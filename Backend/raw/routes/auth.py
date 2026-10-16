from fastapi import HTTPException, Depends, status, APIRouter, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, utils, oauth
from ..config import settings
from ..database import get_db

router = APIRouter(tags=["Authentication"], prefix="/auth")


@router.post("/login")
def login_user(
    response: Response,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # OAuth2PasswordRequestForm always names the login field "username".
    # In this app that field holds the phone number.
    user = db.query(models.User).filter(models.User.phone == form.username).first()

    # One check, one message: don't reveal whether the phone is registered.
    if not user or not utils.verify_password(form.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = oauth.create_token(data={"owner_id": user.id})
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=False,  # set to True in production (HTTPS)
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )
    return {"message": "Login successful"}


@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,  # keep in sync with login
        samesite="lax",
    )
    return {"message": "Logout successful"}
