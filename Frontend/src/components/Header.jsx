import { Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const [open, setOpen] = useState(false); const { count } = useCart(); const { user, logout } = useAuth(); const navigate = useNavigate()
  const signOut = async () => { await logout(); navigate('/') }
  return <header className="site-header"><Link className="brand" to="/">egg<span>&amp;</span>co</Link><nav className={open ? 'nav open' : 'nav'}><NavLink to="/shop">Shop</NavLink>{user && user.role === 'CUSTOMER' && <NavLink to="/orders">My orders</NavLink>}{user?.role === 'ADMIN' && <NavLink to="/admin">Admin</NavLink>}<Link className="cart-link" to="/cart"><ShoppingBag size={18} /> Basket <b>{count}</b></Link>{user ? <button className="button secondary" onClick={signOut}>Log out</button> : <><Link className="login-link" to="/login">Log in</Link><Link className="button primary" to="/register">Sign up</Link></>}</nav><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button></header>
}
