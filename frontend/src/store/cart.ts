import { atom, map } from 'nanostores';

export const $isCartOpen = atom(false);

export type CartItem = {
  id: string;
  title: string;
  imageSrc: string;
  quantity: number;
}

export const $cartItems = map<Record<string, CartItem>>({});

type ItemDisplayInfo = Pick<CartItem, 'id' | 'title' | 'imageSrc'>;
export function addCartItem({ id, title, imageSrc }: ItemDisplayInfo) {

  const existingEntry = $cartItems.get()[id];
  if (existingEntry) {
    $cartItems.setKey(id, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    $cartItems.setKey(
      id,
      { id, title, imageSrc, quantity: 1 }
    );
  }
}
