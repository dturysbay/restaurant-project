import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent {
  open = input<boolean>(false);
  close = output<void>();

  cart = inject(CartService);
  ordered = signal(false);

  placeOrder(): void {
    this.ordered.set(true);
    setTimeout(() => {
      this.cart.clear();
      this.ordered.set(false);
      this.close.emit();
    }, 2200);
  }
}
