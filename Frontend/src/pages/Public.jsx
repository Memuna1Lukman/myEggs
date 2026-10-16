import { Check, ChevronRight, Egg, Menu, ShoppingBasket, Star, Truck, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const eggBoxes = [
  { name: 'Free Range Eggs', detail: 'Large brown eggs · dozen', price: 'From $6.99', image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85' },
  { name: 'Pasture Raised Eggs', detail: 'Rich golden yolks · dozen', price: 'From $8.49', image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=900&q=85' },
  { name: 'Family Farm Pack', detail: 'Fresh large eggs · 30 pack', price: 'From $14.99', image: 'https://images.unsplash.com/photo-1498654077810-12c0c5b2b6b1?auto=format&fit=crop&w=900&q=85' },
]

export default function Public() {
  const [menuOpen, setMenuOpen] = useState(false)

  return <main className="egg-home">
    <div className="egg-topbar">Free local delivery on orders over $25 <span>•</span> Laid fresh, packed with care</div>
    <header className="egg-header">
      <Link className="egg-brand" to="/" aria-label="Sunny Side Farm home"><Egg size={28} strokeWidth={2.4} /><span>Sunny Side<small>FARM EGGS</small></span></Link>
      <nav className={menuOpen ? 'egg-nav open' : 'egg-nav'} aria-label="Main navigation">
        <a href="#our-eggs" onClick={() => setMenuOpen(false)}>Our eggs</a>
        <a href="#why-us" onClick={() => setMenuOpen(false)}>Why Sunny Side</a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
        <Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
        <Link className="egg-nav-shop" to="/shop" onClick={() => setMenuOpen(false)}>Shop eggs</Link>
      </nav>
      <Link className="egg-basket" to="/cart" aria-label="View basket"><ShoppingBasket size={21} /><span>Basket</span></Link>
      <button className="egg-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section className="egg-hero">
      <div className="egg-hero-copy">
        <p className="egg-kicker"><span /> FROM OUR FARM TO YOUR TABLE</p>
        <h1>Good eggs make <em>good days.</em></h1>
        <p className="egg-intro">Wholesome, delicious eggs from happy hens—delivered fresh from our family farm to your kitchen.</p>
        <div className="egg-actions"><Link className="egg-button primary" to="/shop">Shop fresh eggs <ChevronRight size={18} /></Link><a className="egg-text-link" href="#why-us">Meet our hens</a></div>
        <div className="egg-ratings"><div className="egg-stars"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /></div><span>Loved by 2,000+ local families</span></div>
      </div>
      <div className="egg-hero-photo"><div className="egg-price-tag"><strong>Fresh every week</strong><span>Collected & packed daily</span></div></div>
    </section>

    <section className="egg-promises" aria-label="Shopping benefits"><div><Truck /><span><strong>Local delivery</strong>To your doorstep, 6 days a week</span></div><div><Egg /><span><strong>Farm fresh</strong>Collected and packed daily</span></div><div><Check /><span><strong>Happy hens</strong>Raised with room to roam</span></div></section>

    <section className="egg-products" id="our-eggs">
      <div className="egg-section-heading"><div><p className="egg-kicker"><span /> SHOP THE FARM STAND</p><h2>Eggs for every kitchen.</h2></div><Link to="/shop">View all eggs <ChevronRight size={17} /></Link></div>
      <div className="egg-product-grid">{eggBoxes.map((box) => <article className="egg-product-card" key={box.name}><img src={box.image} alt={box.name} /><div><p>{box.detail}</p><h3>{box.name}</h3><div className="egg-card-footer"><strong>{box.price}</strong><Link aria-label={`Shop ${box.name}`} to="/shop"><ChevronRight size={19} /></Link></div></div></article>)}</div>
    </section>

    <section className="egg-story" id="why-us"><div className="egg-story-image" /><div className="egg-story-copy"><p className="egg-kicker"><span /> A BETTER KIND OF FARM</p><h2>Raised with care, from sunrise to sunset.</h2><p>Our hens spend their days scratching, pecking, and basking outdoors. We believe better lives make better eggs—and you can taste the difference.</p><ul><li><Check size={17} /> No added hormones or antibiotics</li><li><Check size={17} /> Family-owned and locally raised</li><li><Check size={17} /> Freshness you can see and taste</li></ul><a className="egg-text-link" href="#how-it-works">How our farm works</a></div></section>

    <section className="egg-how" id="how-it-works"><p className="egg-kicker"><span /> SIMPLE AS 1, 2, 3</p><h2>Fresh eggs, without the farm run.</h2><div>{[['01', 'Choose your eggs', 'Pick your favorite cartons and how often you need them.'], ['02', 'We pack them fresh', 'Your order is carefully packed shortly after collection.'], ['03', 'Enjoy at home', 'We deliver right to your door, ready for breakfast.']].map(([num, title, copy]) => <article key={num}><b>{num}</b><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="egg-cta"><div><p className="egg-kicker"><span /> JOIN THE FARM FAMILY</p><h2>Start your fresh egg routine.</h2></div><Link className="egg-button light" to="/register">Create an account <ChevronRight size={18} /></Link></section>
    <footer className="egg-footer"><Link className="egg-brand" to="/"><Egg size={24} /><span>Sunny Side<small>FARM EGGS</small></span></Link><p>© 2026 Sunny Side Farm Eggs</p><div><a href="#our-eggs">Shop</a><a href="#why-us">Our farm</a><Link to="/login">Log in</Link></div></footer>
  </main>
}
