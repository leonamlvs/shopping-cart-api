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
    const existingItem = this.items.find((i) => i.id === item.id)

    if (!existingItem) {
      this.items.push(item)
      return
    }

    existingItem.quantity += item.quantity
  }
}
