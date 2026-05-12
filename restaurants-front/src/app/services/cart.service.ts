import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  cartItems = this.items.asReadonly();

  totalCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((sum, i) => sum + i.menuItem.priceKzt * i.quantity, 0)
  );

  add(item: MenuItem, restaurantName: string): void {
    this.items.update(cart => {
      const existing = cart.find(c => c.menuItem.id === item.id);
      if (existing) {
        return cart.map(c =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...cart, { menuItem: item, quantity: 1, restaurantName }];
    });
  }

  remove(itemId: number): void {
    this.items.update(cart => cart.filter(c => c.menuItem.id !== itemId));
  }

  decrement(itemId: number): void {
    this.items.update(cart =>
      cart
        .map(c => c.menuItem.id === itemId ? { ...c, quantity: c.quantity - 1 } : c)
        .filter(c => c.quantity > 0)
    );
  }

  clear(): void {
    this.items.set([]);
  }
}
