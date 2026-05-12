import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';

const CUISINES = [
  { value: '', label: '🍽️ All' },
  { value: 'японский', label: '🍣 Japanese' },
  { value: 'итальянский', label: '🍝 Italian' },
  { value: 'пицца', label: '🍕 Pizza' },
  { value: 'американский', label: '🍔 American' },
  { value: 'индийский', label: '🍛 Indian' },
  { value: 'китайский', label: '🥟 Chinese' },
  { value: 'турецкий', label: '🥙 Turkish' },
  { value: 'мексиканский', label: '🌮 Mexican' },
  { value: 'французский', label: '🥐 French' },
  { value: 'здоровая', label: '🥗 Healthy' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private restaurantService = inject(RestaurantService);

  cuisines = CUISINES;
  restaurants = signal<Restaurant[]>([]);
  selectedCuisine = signal('');
  loading = signal(true);

  readonly pageSize = 9;
  page = signal(1);

  totalPages = computed(() => Math.ceil(this.restaurants().length / this.pageSize));

  pagedRestaurants = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.restaurants().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const cur = this.page();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (cur > 3) pages.push('…');
    for (let p = Math.max(2, cur - 1); p <= Math.min(total - 1, cur + 1); p++) pages.push(p);
    if (cur < total - 2) pages.push('…');
    pages.push(total);
    return pages;
  });

  ngOnInit(): void {
    this.load();
  }

  selectCuisine(value: string): void {
    this.selectedCuisine.set(value);
    this.page.set(1);
    this.load();
  }

  goToPage(p: number | '…'): void {
    if (typeof p === 'number') this.page.set(p);
  }

  private load(): void {
    this.loading.set(true);
    const cuisine = this.selectedCuisine() || undefined;
    this.restaurantService.getAll(cuisine).subscribe({
      next: (data) => { this.restaurants.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
