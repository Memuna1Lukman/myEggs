from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, oauth
from ..database import get_db


router = APIRouter(tags=["Products"], prefix="/products")


# PUBLIC: anyone can browse products, no login needed.
@router.get("", response_model=List[schemas.GetProduct])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


# ADMIN ONLY from here down.
@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.ProductCreate,
)
def create_product(
    product: schemas.ProductPost,
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth.require_admin),
):
         
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=schemas.ProductCreate)
def update_product(
    product_id: int,
    product: schemas.ProductPost,
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth.require_admin),
):
    existing = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # PUT replaces every field with the values sent in the request.
    for field, value in product.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth.require_admin),
):
    existing = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    try:
        db.delete(existing)
        db.commit()
    except IntegrityError:
        # The product appears in past orders. Keep the history intact.
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This product is in past orders and can't be deleted. "
            "Mark it out of stock instead.",
        )