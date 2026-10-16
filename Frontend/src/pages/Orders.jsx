import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { apiFetch } from '../api/client'
export default function Orders() {
  const [orders, setOrders] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const location = useLocation()
  const load = () => { setLoading(true); apiFetch('/orders/my').then(setOrders).catch((e) => setError(e.message)).finally(() => setLoading(false)) }
  useEffect(() => { apiFetch('/orders/my').then(setOrders).catch((e) => setError(e.message)).finally(() => setLoading(false)) }, [])
  const cancel = async (id) => { try { await apiFetch(`/orders/${id}/cancel`, { method: 'POST' }); load() } catch (e) { setError(e.message) } }
  return <main className="page"><div className="page-heading"><div><p className="eyebrow">Delivery tracking</p><h1>My orders</h1></div></div>{location.state?.notice && <p className="notice">{location.state.notice}</p>}{error && <p className="form-error">{error}</p>}{loading ? <p className="page-state">Loading orders…</p> : !orders.length ? <section className="empty-state"><h2>No orders yet</h2><p>Your completed orders will appear here.</p></section> : <section className="order-grid">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-head"><div><span className="status">{order.status.replaceAll('_', ' ')}</span><h2>Order #{order.id}</h2></div><strong>{order.total_amount.toLocaleString()}</strong></div><p className="muted">{new Date(order.created_at).toLocaleString()} · {order.payment_method} · {order.payment_status}</p><ul>{order.items.map((item) => <li key={item.id}>{item.quantity} × {item.product.name}</li>)}</ul>{order.status === 'PENDING' && <button className="button danger" onClick={() => cancel(order.id)}>Cancel order</button>}</article>)}</section>}</main>
}
