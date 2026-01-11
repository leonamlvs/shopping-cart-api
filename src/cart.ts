import { randomUUID } from 'node:crypto'
import type { CartItem, CartResult } from './cart.interface'

export class Cart {
  readonly MAX_DISCOUNT: number = 50
  readonly id: string

  private items: CartItem[]
  private discountPercent: number = 0

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

    if (item.price < 0) {
      return {
        type: 'INVALID_PRICE',
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
      }
    }

    const existingItem = this.findItem(item.id)

    if (existingItem) {
      existingItem.quantity += item.quantity

      return {
        type: 'ITEM_UPDATED',
        itemId: existingItem.id,
        quantity: existingItem.quantity,
        price: item.price,
      }
    }

    this.items.push({ ...item })

    return {
      type: 'ITEM_ADDED',
      itemId: item.id,
      quantity: item.quantity,
      price: item.price,
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
      price: item.price,
    }
  }

  applyDiscount(percent: number): number {
    return (this.discountPercent = this.normalizeDiscount(percent))
  }

  private normalizeDiscount(percent: number): number {
    if (percent < 0) return 0
    return Math.min(percent, this.MAX_DISCOUNT)
  }

  getDiscount(): number {
    return (this.getSubtotal() * this.discountPercent) / 100
  }

  getTotalPrice(): number {
    return Math.max(this.getSubtotal() - this.getDiscount(), 0)
  }

  private findItem(itemId: string): CartItem | undefined {
    return this.items.find((item) => item.id === itemId)
  }

  private getSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + (item.price ?? 0) * item.quantity,
      0
    )
  }
}
