import datetime

from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, oauth
from ..database import get_db


router = APIRouter(
    tags=["Orders"],
    prefix="/orders"
)


@router.get("/my",response_model=List[schemas.History],status_code=status.HTTP_201_CREATED)
def myOrders(db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    queries = db.query(models.Order).filter(
        models.Order.user_id == current_user.id 
    ).first()
    if not queries:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not Found")
    my_orders = db.query(models.OrderItem).all()
    return my_orders


@router.post("/",response_model=schemas.PlaceOrders,status_code=status.HTTP_201_CREATED)
def place_orders(order:schemas.PostOrders,db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    new_order = models.order(**order.model_dump())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order


# for the admins
@router.get("",response_model=List[schemas.AdminOrders])
def get_admin_orders(limit:int,offset:int,createdAt:datetime,db:Session=Depends(get_db),require_admin:models.User=Depends(oauth.require_admin)):
    get_all = db.query(models.OrderItem).limit(limit).offset(offset).createdAt(createdAt).all()
    return get_all


# @router.patch("/{order_id}",response_model=schemas.UpdatedOrders)
# def patched_orders(order_id:int,)