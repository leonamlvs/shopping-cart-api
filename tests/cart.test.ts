import { Cart } from '../src/cart'

describe('Cart items', () => {
  it('should create an empty cart', () => {
    const cart = new Cart()

    expect(cart.id).toBeDefined()
    expect(cart.getItems()).toHaveLength(0)
  })

  it('should add an item to the cart', () => {
    const cart = new Cart()

    const result = cart.addItem({ id: 'item1', quantity: 1, price: 10 })

    expect(result).toEqual({
      type: 'ITEM_ADDED',
      itemId: 'item1',
      quantity: 1,
      price: 10,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 1, price: 10 }])
  })

  it('should update quantity when adding a duplicate item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1, price: 10 })
    const result = cart.addItem({ id: 'item1', quantity: 2, price: 10 })

    expect(result).toEqual({
      type: 'ITEM_UPDATED',
      itemId: 'item1',
      quantity: 3,
      price: 10,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 3, price: 10 }])
  })

  it('should remove an item from the cart', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1, price: 10 })

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

    cart.addItem({ id: 'item1', quantity: 1, price: 10 })
    const result = cart.changeItemQuantity('item1', 2)

    expect(result).toEqual({
      type: 'ITEM_UPDATED',
      itemId: 'item1',
      quantity: 3,
      price: 10,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 3, price: 10 }])
  })

  it('should decrease quantity for an existing item', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2, price: 10 })
    const result = cart.changeItemQuantity('item1', -1)

    expect(result).toEqual({
      type: 'ITEM_UPDATED',
      itemId: 'item1',
      quantity: 1,
      price: 10,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 1, price: 10 }])
  })

  it('should remove item if quantity reaches zero', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 1, price: 10 })
    const result = cart.changeItemQuantity('item1', -1)

    expect(result).toEqual({
      type: 'ITEM_REMOVED',
      itemId: 'item1',
    })

    expect(cart.getItems()).toHaveLength(0)
  })

  it('should not add items with zero or negative quantity', () => {
    const cart = new Cart()

    const resultZero = cart.addItem({ id: 'item1', quantity: 0, price: 10 })
    const resultNegative = cart.addItem({
      id: 'item2',
      quantity: -1,
      price: 10,
    })

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

    cart.addItem({ id: 'item1', quantity: 1, price: 10 })

    const result = cart.changeItemQuantity('item1', 0)

    expect(result).toEqual({
      type: 'INVALID_QUANTITY',
      itemId: 'item1',
      quantity: 0,
    })

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 1, price: 10 }])
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

describe('Cart pricing', () => {
  it('should calculate subtotal correctly', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2, price: 5 })
    cart.addItem({ id: 'item2', quantity: 3, price: 10 })

    expect(cart.getItems().map((i) => i.price)).toEqual([5, 10])
    expect(cart.getItems().map((i) => i.quantity)).toEqual([2, 3])
    expect(cart.getTotalPrice()).toBe(2 * 5 + 3 * 10)
  })

  it('should not allow negative item price', () => {
    const cart = new Cart()
    const result = cart.addItem({ id: 'item1', quantity: 1, price: -1 })

    expect(result.type).toBe('INVALID_PRICE')
    expect(cart.getItems()).toHaveLength(0)
  })

  it('should apply discount within allowed range', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2, price: 10 })

    expect(cart.applyDiscount(20)).toBe(20)
    expect(cart.getDiscount()).toBe(4)
    expect(cart.getTotalPrice()).toBe(16)
  })

  it('should cap discount at MAX_DISCOUNT', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2, price: 10 })

    expect(cart.applyDiscount(60)).toBe(50)
    expect(cart.getDiscount()).toBe(10)
    expect(cart.getTotalPrice()).toBe(10)
  })

  it('should ignore negative discount', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2, price: 10 })

    expect(cart.applyDiscount(-10)).toBe(0)
    expect(cart.getDiscount()).toBe(0)
    expect(cart.getTotalPrice()).toBe(20)
  })

  it('should calculate total correctly for empty cart', () => {
    const cart = new Cart()

    expect(cart.getTotalPrice()).toBe(0)
    expect(cart.applyDiscount(20)).toBe(20)
    expect(cart.getDiscount()).toBe(0)
  })

  it('should maintain item prices when applying discount', () => {
    const cart = new Cart()

    cart.addItem({ id: 'item1', quantity: 2, price: 10 })
    cart.applyDiscount(20)

    expect(cart.getItems()).toEqual([{ id: 'item1', quantity: 2, price: 10 }])
  })
})
