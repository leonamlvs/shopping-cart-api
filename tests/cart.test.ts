import { Cart } from '../src/cart'

describe('Cart', () => {
  it('should create an empty cart', () => {
    const cart = new Cart()

    expect(cart.id).toBeDefined()
    expect(cart.items).toHaveLength(0)
  })
})
