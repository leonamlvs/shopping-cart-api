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
    this.items.push(item)
  }
}
