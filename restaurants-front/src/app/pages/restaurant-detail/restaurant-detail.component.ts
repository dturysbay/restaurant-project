import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { CartService } from '../../services/cart.service';
import { Restaurant } from '../../models/restaurant.model';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './restaurant-detail.component.html',
})
export class RestaurantDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private restaurantService = inject(RestaurantService);
  cart = inject(CartService);

  restaurant = signal<Restaurant | null>(null);
  menuItems = signal<MenuItem[]>([]);
  categories = signal<string[]>([]);
  activeCategory = signal('');
  loading = signal(true);
  addedItemId = signal<number | null>(null);

  cuisineTags = computed(() =>
    (this.restaurant()?.cuisineTags ?? '').split(',').map(t => t.trim()).filter(Boolean)
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.restaurantService.getById(id).subscribe(r => this.restaurant.set(r));
    this.restaurantService.getMenu(id).subscribe(items => {
      this.menuItems.set(items);
      const cats = [...new Set(items.map(i => i.menuCategory))];
      this.categories.set(cats);
      if (cats.length) this.activeCategory.set(cats[0]);
      this.loading.set(false);
    });
  }

  filteredItems(): MenuItem[] {
    return this.menuItems().filter(i => i.menuCategory === this.activeCategory());
  }

  addToCart(item: MenuItem): void {
    this.cart.add(item, this.restaurant()?.name ?? '');
    this.addedItemId.set(item.id);
    setTimeout(() => this.addedItemId.set(null), 1000);
  }

  removeOne(item: MenuItem): void {
    this.cart.decrement(item.id);
  }

  quantityOf(itemId: number): number {
    return this.cart.cartItems().find(c => c.menuItem.id === itemId)?.quantity ?? 0;
  }

  categoryEmoji(): string {
    const cat = this.activeCategory().toLowerCase();
    if (/новинк/.test(cat)) return '🆕';
    if (/баскет/.test(cat)) return '🧺';
    if (/куриц/.test(cat)) return '🍗';
    if (/бургер/.test(cat)) return '🍔';
    if (/пицц/.test(cat)) return '🍕';
    if (/ролл|суши/.test(cat)) return '🍱';
    if (/соус/.test(cat)) return '🥫';
    if (/напит|drink/.test(cat)) return '🥤';
    if (/десерт/.test(cat)) return '🍰';
    if (/салат/.test(cat)) return '🥗';
    if (/суп/.test(cat)) return '🍜';
    if (/донер|шаурм/.test(cat)) return '🌯';
    if (/паст/.test(cat)) return '🍝';
    if (/рыб/.test(cat)) return '🐟';
    return '🍽️';
  }

  itemGradient(name: string): string {
    const palettes = [
      'linear-gradient(135deg,#fef3c7,#fde68a)',
      'linear-gradient(135deg,#dbeafe,#bfdbfe)',
      'linear-gradient(135deg,#d1fae5,#a7f3d0)',
      'linear-gradient(135deg,#fce7f3,#fbcfe8)',
      'linear-gradient(135deg,#ede9fe,#ddd6fe)',
      'linear-gradient(135deg,#ffedd5,#fed7aa)',
      'linear-gradient(135deg,#ecfccb,#d9f99d)',
    ];
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
    return palettes[h % palettes.length];
  }
}
