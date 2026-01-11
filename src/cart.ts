import { randomUUID } from 'node:crypto'
import type { CartItem } from './cart.interface'

export class Cart {
  id: string
  items: CartItem[]

  constructor(items: CartItem[] = []) {
    this.id = randomUUID()
    this.items = items
  }

  addItem(item: CartItem) {
    this.updateItemQuantity(item.id, item.quantity)
  }

  removeItem(itemId: string) {
    this.items = this.items.filter((item) => item.id !== itemId)
  }

  updateItemQuantity(itemId: string, quantity: number) {
    const item = this.items.find((i) => i.id === itemId)

    if (item) {
      return (item.quantity += quantity) <= 0
        ? this.removeItem(itemId)
        : item.quantity
    }

    return quantity > 0
      ? this.items.push({ id: itemId, quantity: quantity })
      : null
  }
}
