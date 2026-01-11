import { Cart } from '../src/cart'

describe('Cart', () => {
  it('should create an empty cart', () => {
    const cart = new Cart()

    expect(cart.id).toBeDefined()
    expect(cart.getItems()).toHaveLength(0)
  })

  it('should add an item to the cart', () => {
    const cart = new Cart()

    const result = cart.addItem({ id: 'item1', quantity: 1 })

    expect(result).toEqual({
      type: 'ITEM_ADDED',
      itemId: 'item1',
      quantity: 1,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 1 }])
  })

  it('should update quantity when adding a duplicate item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    const result = cart.addItem({ id: 'item1', quantity: 2 })

    expect(result).toEqual({
      type: 'ITEM_UPDATED',
      itemId: 'item1',
      quantity: 3,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 3 }])
  })

  it('should remove an item from the cart', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })

    const result = cart.removeItem('item1')

    expect(result).toEqual({
      type: 'ITEM_REMOVED',
      itemId: 'item1',
    })

    expect(cart.getItems()).toHaveLength(0)
  })

  it('should return ITEM_NOT_FOUND when removing a missing item', () => {
    const cart = new Cart()

    const result = cart.removeItem('missing')

    expect(result).toEqual({
      type: 'ITEM_NOT_FOUND',
      itemId: 'missing',
    })
  })

  it('should increase quantity for an existing item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    const result = cart.changeItemQuantity('item1', 2)

    expect(result).toEqual({
      type: 'ITEM_UPDATED',
      itemId: 'item1',
      quantity: 3,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 3 }])
  })

  it('should decrease quantity for an existing item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2 })
    const result = cart.changeItemQuantity('item1', -1)

    expect(result).toEqual({
      type: 'ITEM_UPDATED',
      itemId: 'item1',
      quantity: 1,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 1 }])
  })

  it('should remove item if quantity reaches zero', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    const result = cart.changeItemQuantity('item1', -1)

    expect(result).toEqual({
      type: 'ITEM_REMOVED',
      itemId: 'item1',
    })

    expect(cart.getItems()).toHaveLength(0)
  })

  it('should not add items with zero or negative quantity', () => {
    const cart = new Cart()

    const resultZero = cart.addItem({ id: 'item1', quantity: 0 })
    const resultNegative = cart.addItem({ id: 'item2', quantity: -1 })

    expect(resultZero).toEqual({
      type: 'INVALID_QUANTITY',
      itemId: 'item1',
      quantity: 0,
    })

    expect(resultNegative).toEqual({
      type: 'INVALID_QUANTITY',
      itemId: 'item2',
      quantity: -1,
    })

    expect(cart.getItems()).toHaveLength(0)
  })

  it('should return INVALID_QUANTITY when delta is zero', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1 })
    const result = cart.changeItemQuantity('item1', 0)

    expect(result).toEqual({
      type: 'INVALID_QUANTITY',
      itemId: 'item1',
      quantity: 0,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 1 }])
  })

  it('should return ITEM_NOT_FOUND when updating a missing item', () => {
    const cart = new Cart()

    const result = cart.changeItemQuantity('missing', 1)

    expect(result).toEqual({
      type: 'ITEM_NOT_FOUND',
      itemId: 'missing',
    })
  })
})
