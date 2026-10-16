/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const addItem = (product) => setItems((current) => {
    const found = current.find((item) => item.id === product.id)
    return found
      ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]
  })
  const updateQuantity = (id, quantity) => setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item))
  const clearCart = () => setItems([])
  const value = useMemo(() => ({ items, addItem, updateQuantity, clearCart, count: items.reduce((sum, item) => sum + item.quantity, 0) }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
