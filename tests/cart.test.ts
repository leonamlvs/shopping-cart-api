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

  it('should not allow duplicate items', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    cart.addItem({ id: 'item1', quantity: 1 })

    expect(cart.items).toHaveLength(1)
  })

  it('should remove an item from the cart', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })

    expect(cart.items).toHaveLength(1)

    cart.removeItem('item1')

    expect(cart.items).toHaveLength(0)
  })

  it('should increase quantity for existing item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    cart.updateItemQuantity('item1', 2)

    expect(cart.items).toEqual([{ id: 'item1', quantity: 3 }])
  })

  it('should decrease quantity for existing item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2 })
    cart.updateItemQuantity('item1', -1)

    expect(cart.items).toEqual([{ id: 'item1', quantity: 1 }])
  })

  it('should remove item if quantity reaches zero', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    cart.updateItemQuantity('item1', -1)

    expect(cart.items).toHaveLength(0)
  })

  it('should not add item with quantity zero or negative', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 0 })

    expect(cart.items).toHaveLength(0)

    cart.addItem({ id: 'item1', quantity: -1 })

    expect(cart.items).toHaveLength(0)

    cart.addItem({ id: 'item1', quantity: 1 })
    cart.updateItemQuantity('item1', -2)

    expect(cart.items).toHaveLength(0)
  })

  it('should update item quantity with positive or negative values', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 3 })

    cart.updateItemQuantity('item1', -2)

    expect(cart.items).toEqual([{ id: 'item1', quantity: 1 }])

    cart.updateItemQuantity('item1', 1)

    expect(cart.items).toEqual([{ id: 'item1', quantity: 2 }])
  })
})
