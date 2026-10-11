import enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


# --- ENUMS ---

class UserRole(str, enum.Enum):
    """Global (app-wide) role."""
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


# --- MODELS ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=False, unique=True, index=True)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # No delete cascade: order history is business data, keep it.
    orders = relationship("Order", back_populates="user")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)  # whole currency units
    in_stock = Column(Boolean, nullable=False, default=True)
    image_url = Column(String, nullable=True)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(
        SAEnum(OrderStatus),
        nullable=False,
        default=OrderStatus.PENDING,
        index=True,
    )
    total_amount = Column(Integer, nullable=False)
    delivery_address = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    note = Column(String, nullable=True)
    payment_method = Column(String, nullable=True, default="MoMo")
    payment_status = Column(String, nullable=True, default="Not Paid")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)
    order_id = Column(
        Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # No cascade here: deleting a product must not erase past orders.
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Integer, nullable=False)  # price at the time of order

    order = relationship("Order", back_populates="items")
    product = relationship("Product")