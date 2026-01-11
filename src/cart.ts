import { randomUUID } from 'node:crypto'
import type { CartItem, CartResult } from './cart.interface'

export class Cart {
  readonly id: string
  private items: CartItem[]

  constructor(items: CartItem[] = []) {
    this.id = randomUUID()
    this.items = items
  }

  getItems(): CartItem[] {
    return [...this.items]
  }

  addItem(item: CartItem): CartResult {
    if (item.quantity <= 0) {
      return {
        type: 'INVALID_QUANTITY',
        itemId: item.id,
        quantity: item.quantity,
      }
    }

    const existingItem = this.findItem(item.id)

    if (existingItem) {
      existingItem.quantity += item.quantity

      return {
        type: 'ITEM_UPDATED',
        itemId: existingItem.id,
        quantity: existingItem.quantity,
      }
    }

    this.items.push({ ...item })

    return {
      type: 'ITEM_ADDED',
      itemId: item.id,
      quantity: item.quantity,
    }
  }

  removeItem(itemId: string): CartResult {
    const item = this.findItem(itemId)

    if (!item) {
      return { type: 'ITEM_NOT_FOUND', itemId }
    }

    this.items = this.items.filter((i) => i.id !== itemId)

    return { type: 'ITEM_REMOVED', itemId }
  }

  changeItemQuantity(itemId: string, delta: number): CartResult {
    if (delta === 0) {
      return {
        type: 'INVALID_QUANTITY',
        itemId,
        quantity: delta,
      }
    }

    const item = this.findItem(itemId)

    if (!item) {
      return { type: 'ITEM_NOT_FOUND', itemId }
    }

    item.quantity += delta

    if (item.quantity <= 0) {
      this.items = this.items.filter((i) => i.id !== itemId)
      return { type: 'ITEM_REMOVED', itemId }
    }

    return {
      type: 'ITEM_UPDATED',
      itemId,
      quantity: item.quantity,
    }
  }

  private findItem(itemId: string): CartItem | undefined {
    return this.items.find((item) => item.id === itemId)
  }
}
