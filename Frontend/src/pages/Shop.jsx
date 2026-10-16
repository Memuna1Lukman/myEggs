import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { useCart } from '../context/CartContext'

export default function Shop() {
  const [products, setProducts] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  useEffect(() => { apiFetch('/products').then(setProducts).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [])
  return <main className="page"><div className="page-heading"><div><p className="eyebrow">Farm-fresh delivery</p><h1>Choose your crate.</h1><p className="muted">Prices and availability are always up to date.</p></div><Link className="button secondary" to="/cart">View basket</Link></div>
    {loading && <p className="page-state">Loading products…</p>}{error && <p className="form-error">{error}</p>}
    {!loading && !error && <section className="product-grid">{products.map((product) => <article className="product-card" key={product.id}><div className="product-image">{product.image_url ? <img src={product.image_url} alt={product.name} /> : '🥚'}</div><div><span className={product.in_stock ? 'status available' : 'status'}>{product.in_stock ? 'In stock' : 'Out of stock'}</span><h2>{product.name}</h2><p className="muted">{product.description}</p><div className="card-footer"><strong>{product.price.toLocaleString()}</strong><button className="button primary" disabled={!product.in_stock} onClick={() => addItem(product)}>{product.in_stock ? 'Add to basket' : 'Unavailable'}</button></div></div></article>)}</section>}
  </main>
}
