import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
export default function Checkout() {
  const { items, clearCart } = useCart(); const { user } = useAuth(); const navigate = useNavigate(); const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ delivery_address: '', phone: user.phone || '', note: '', payment_method: 'MoMo' })
  if (!items.length) return <Navigate to="/cart" replace />
  const submit = async (e) => { e.preventDefault(); setError(''); setSaving(true); try { await apiFetch('/orders/', { method: 'POST', body: JSON.stringify({ ...form, items: items.map(({ id, quantity }) => ({ product_id: id, quantity })) }) }); clearCart(); navigate('/orders', { state: { notice: 'Order placed — we will confirm it soon.' } }) } catch (err) { setError(err.message) } finally { setSaving(false) } }
  return <main className="page narrow"><div className="page-heading"><div><p className="eyebrow">Almost there</p><h1>Delivery details</h1></div></div><form className="form-stack checkout-card" onSubmit={submit}><label>Delivery address<textarea required value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} /></label><label>Contact phone<input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>Payment method<select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}><option>MoMo</option><option>Pay on delivery</option><option>Bank transfer</option></select></label><label>Notes (optional)<textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></label>{error && <p className="form-error">{error}</p>}<button className="button primary" disabled={saving}>{saving ? 'Placing order…' : 'Place order'}</button></form></main>
}
