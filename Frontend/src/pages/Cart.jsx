import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
export default function Cart() {
  const { items, updateQuantity } = useCart(); const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  return <main className="page narrow"><div className="page-heading"><div><p className="eyebrow">Your order</p><h1>Basket</h1></div><Link to="/shop" className="button secondary">Keep shopping</Link></div>
    {!items.length ? <section className="empty-state"><h2>Your basket is empty</h2><p>Add a crate to get started.</p><Link className="button primary" to="/shop">Browse products</Link></section> : <><section className="cart-list">{items.map((item) => <article className="cart-row" key={item.id}><div><h2>{item.name}</h2><p className="muted">{item.price.toLocaleString()} each</p></div><label className="quantity">Qty<input aria-label={`Quantity for ${item.name}`} type="number" min="0" max="100" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} /></label><strong>{(item.price * item.quantity).toLocaleString()}</strong></article>)}</section><section className="total-bar"><span>Total <strong>{total.toLocaleString()}</strong></span><Link className="button primary" to="/checkout">Checkout</Link></section></>}
  </main>
}
