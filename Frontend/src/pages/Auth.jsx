import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Auth({ mode }) {
  const isLogin = mode === 'login'
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault(); setError(''); setSaving(true)
    try {
      if (isLogin) await login(form.phone, form.password)
      else { await register(form); await login(form.phone, form.password) }
      navigate(location.state?.from || '/shop', { replace: true })
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }
  return <main className="auth-page"><section className="auth-card">
    <Link className="brand" to="/">egg<span>&amp;</span>co</Link>
    <p className="eyebrow">{isLogin ? 'Welcome back' : 'Fresh eggs, simply ordered'}</p>
    <h1>{isLogin ? 'Log in to your account' : 'Create your account'}</h1>
    <p className="muted">{isLogin ? 'Use the phone number you registered with.' : 'Customer accounts can place orders and track delivery.'}</p>
    <form onSubmit={submit} className="form-stack">
      {!isLogin && <label>Name<input required minLength="1" maxLength="100" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="name" /></label>}
      <label>Phone number<input required minLength="5" maxLength="30" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" /></label>
      <label>Password<input required minLength="8" maxLength="128" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete={isLogin ? 'current-password' : 'new-password'} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary" disabled={saving}>{saving ? 'Please wait…' : isLogin ? 'Log in' : 'Create account'}</button>
    </form>
    <p className="switch-copy">{isLogin ? 'New here?' : 'Already have an account?'} <Link to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create one' : 'Log in'}</Link></p>
  </section></main>
}
