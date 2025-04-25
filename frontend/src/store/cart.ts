import { atom, map } from 'nanostores';

export const $isCartOpen = atom(false);

export type CartItem = {
  id: string;
  title: string;
  imageSrc: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export const $cartItems = map<Record<string, CartItem>>({});

type ItemDisplayInfo = Pick<CartItem, 'id' | 'title' |'imageSrc' |'unitPrice' | 'currency'>;

export function addCartItem({ id, title, imageSrc, currency, unitPrice }: ItemDisplayInfo) {

  const existingEntry = $cartItems.get()[id];
  if (existingEntry) {
    $cartItems.setKey(id, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    $cartItems.setKey(
      id,
      { id, title, imageSrc, unitPrice, currency, quantity: 1 }
    );
  }
}

export function removeCartItem(id: string) {
  const existingEntry = $cartItems.get()[id];
  if (existingEntry) {
    if (existingEntry.quantity > 1) {
      $cartItems.setKey(id, {
        ...existingEntry,
        quantity: existingEntry.quantity - 1,
      });
    } else {
      $cartItems.setKey(id, undefined);
    }
  }
}

export function clearCart() {
  $cartItems.set({});
}
