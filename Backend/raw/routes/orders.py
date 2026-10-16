from datetime import date, datetime, time, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from .. import models, schemas, oauth
from ..database import get_db


router = APIRouter(
    tags=["Orders"],
    prefix="/orders"
)


def order_query(db: Session):
    return db.query(models.Order).options(
        joinedload(models.Order.items).joinedload(models.OrderItem.product),
        joinedload(models.Order.user)
    )




@router.get("/my", response_model=List[schemas.History])
def my_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user),
):
    return (
        order_query(db)
        .filter(models.Order.user_id == current_user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


@router.post("/",response_model=schemas.PlaceOrders,status_code=status.HTTP_201_CREATED)
def place_orders(order:schemas.PostOrders,db:Session=Depends(get_db),current_user:models.User=Depends(oauth.get_current_user)):
    # merge repeted products into one
    quantities={}
    for item in order.items:
        quantities[item.product_id] = quantities.get(item.product_id, 0) + item.quantity
    products = (
        db.query(models.Product)
        .filter(models.Product.id.in_(list(quantities)))
        .all()
    )

    found = {p.id: p for p in products}

    missing = set(quantities) - set(found)
    if missing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product(s) not found: {sorted(missing)}",
        )

    unavailable = [p.name for p in products if not p.in_stock]
    if unavailable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Out of stock: {', '.join(unavailable)}",
        )

    total = 0
    order_items = []
    for product_id, quantity in quantities.items():
        product = found[product_id]
        total += product.price * quantity
        order_items.append(
            models.OrderItem(
                product_id=product_id,
                quantity=quantity,
                unit_price=product.price,  # price at the time of order
            )
        )

    new_order = models.Order(
        user_id=current_user.id,  # from the login, not from the request
        status=models.OrderStatus.PENDING,
        total_amount=total,
        delivery_address=order.delivery_address,
        phone=order.phone or current_user.phone,
        note=order.note,
        payment_method=order.payment_method,
        payment_status="Not Paid",
        items=order_items,
    )
    db.add(new_order)
    db.commit()

    # Reload with items and products so the response is complete.
    return order_query(db).filter(models.Order.id == new_order.id).first()


@router.post("/{order_id}/cancel", response_model=schemas.UpdatedOrders)
def cancel_my_orders(
    order_id:int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth.get_current_user)
):
    order =  (
        order_query(db)
        .filter(models.Order.id == order_id, models.Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    if order.status != models.OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be cancelled. Please contact the seller.",
        )
    order.status = models.OrderStatus.CANCELLED
    db.commit()
    db.refresh(order)
    return order

# for the admins
@router.get("",response_model=List[schemas.AdminOrders])
def get_admin_orders(
    status_filter: Optional[models.OrderStatus] = Query(None, alias="status"),
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth.require_admin)
):
    query = order_query(db)
    if status_filter:
        query=query.filter(models.Order.status == status_filter)
    if date_from:
        start = datetime.combine(date_from, time.min, tzinfo=timezone.utc)
        query = query.filter(models.Order.created_at >= start)
    if date_to:
        # Up to the END of date_to, so that day is included.
        end = datetime.combine(date_to + timedelta(days=1), time.min, tzinfo=timezone.utc)
        query = query.filter(models.Order.created_at < end)

    get_all = query.order_by(models.Order.created_at.desc()).limit(limit).offset(offset).all()
    return get_all


@router.patch("/{order_id}/status",response_model=schemas.UpdatedOrders)
def patched_orders(
    order_id:int,
    update: schemas.StatusUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth.require_admin)
):
    order = order_query(db).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )
    allowed_transitions = {
        models.OrderStatus.PENDING: {
            models.OrderStatus.CONFIRMED,
            models.OrderStatus.CANCELLED,
        },
        models.OrderStatus.CONFIRMED: {
            models.OrderStatus.OUT_FOR_DELIVERY,
            models.OrderStatus.CANCELLED,
        },
        models.OrderStatus.OUT_FOR_DELIVERY: {models.OrderStatus.DELIVERED},
        models.OrderStatus.DELIVERED: set(),
        models.OrderStatus.CANCELLED: set(),
    }
    if update.status not in allowed_transitions[order.status]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Can't change an order from {order.status.value} to {update.status.value}",
        )
    order.status = update.status
    db.commit()
    db.refresh(order)
    return order

@router.patch("/{order_id}/payment", response_model=schemas.UpdatedOrders)
def update_payment_status(
    order_id: int,
    update: schemas.PaymentUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(oauth.require_admin),
):
    order = order_query(db).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Order not found"
        )

    order.payment_status = update.payment_status
    db.commit()
    db.refresh(order)
    return order
