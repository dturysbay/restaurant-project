import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './restaurant-card.component.html',
})
export class RestaurantCardComponent {
  restaurant = input.required<Restaurant>();
}
