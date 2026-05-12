import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  cart = inject(CartService);
  openCart = output<void>();
}
