from fastapi import Depends, HTTPException, APIRouter, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import models, schemas, utils, oauth
from ..database import get_db

router = APIRouter(tags=["Users"])


@router.post(
    "/users",
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.UserCreated,
)
def create_user(user: schemas.UserPost, db: Session = Depends(get_db)):
    # Build the user explicitly. Never pass client data straight into the
    # model, and never let the client choose the role.
    new_user = models.User(
        username=user.username,
        phone=user.phone,
        password=utils.get_password_hash(user.password),
        role=models.UserRole.CUSTOMER,
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Registration failed. This phone number is already registered.",
        )
    return new_user


@router.get("/me", response_model=schemas.UserMe)
def get_me(current_user: models.User = Depends(oauth.get_current_user)):
    # get_current_user already loaded this user from the database,
    # so there is no need to query again.
    return current_user