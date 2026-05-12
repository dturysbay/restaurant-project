import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CartSidebarComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  cartOpen = signal(false);
}
