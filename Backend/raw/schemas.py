from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from .models import OrderStatus, UserRole


class ORMModel(BaseModel):
    """Base schema for data returned from SQLAlchemy models."""

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    id: Optional[int] = None


class UserPost(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    phone: str = Field(min_length=5, max_length=30)


class UserCreated(ORMModel):
    id: int
    username: str
    phone: str
    role: UserRole
    created_at: datetime


class UserMe(UserCreated):
    pass


class UserSummary(ORMModel):
    id: int
    username: str
    phone: str


class ProductPost(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    price: int = Field(ge=0, description="Price in whole currency units")
    in_stock: bool = True
    image_url: Optional[str] = Field(default=None, max_length=2048)


class GetProduct(ORMModel):
    id: int
    name: str
    description: str
    price: int
    in_stock: bool
    image_url: Optional[str]


class ProductCreate(GetProduct):
    pass


class OrderItemPost(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0, le=100)


class OrderItemRead(ORMModel):
    id: int
    product_id: int
    quantity: int
    unit_price: int
    product: GetProduct


class PostOrders(BaseModel):
    items: list[OrderItemPost] = Field(min_length=1)
    delivery_address: str = Field(min_length=1, max_length=500)
    phone: Optional[str] = Field(default=None, min_length=5, max_length=30)
    note: Optional[str] = Field(default=None, max_length=1000)
    payment_method: str = Field(default="MoMo", min_length=1, max_length=50)


class OrderRead(ORMModel):
    id: int
    user_id: int
    status: OrderStatus
    total_amount: int
    delivery_address: str
    phone: str
    note: Optional[str]
    payment_method: Optional[str]
    payment_status: Optional[str]
    created_at: datetime
    items: list[OrderItemRead]


class PlaceOrders(OrderRead):
    pass


class History(OrderRead):
    pass


class AdminOrders(OrderRead):
    user: UserSummary


class UpdatedOrders(AdminOrders):
    pass


class StatusUpdate(BaseModel):
    status: OrderStatus


class PaymentUpdate(BaseModel):
    payment_status: Literal["Not Paid", "Paid", "Failed", "Refunded"]
