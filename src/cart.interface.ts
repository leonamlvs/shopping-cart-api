export type CartItem = {
  id: string
  quantity: number
}

export type CartResult =
  | { type: 'ITEM_ADDED'; itemId: string; quantity: number }
  | { type: 'ITEM_UPDATED'; itemId: string; quantity: number }
  | { type: 'ITEM_REMOVED'; itemId: string }
  | { type: 'ITEM_NOT_FOUND'; itemId: string }
  | { type: 'INVALID_QUANTITY'; itemId: string; quantity: number }
