import { Cart } from '../src/cart'

describe('Cart', () => {
  it('should create an empty cart', () => {
    const cart = new Cart()

    expect(cart.id).toBeDefined()
    expect(cart.items).toHaveLength(0)
  })

  it('should add an item to the cart', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })

    expect(cart.items).toHaveLength(1)
  })
})
