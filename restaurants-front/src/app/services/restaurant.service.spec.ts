import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from '../models/restaurant.model';
import { MenuItem } from '../models/menu-item.model';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;

  const BASE = 'http://localhost:8080/api';

  const mockRestaurant: Restaurant = {
    id: 'abc123',
    name: 'POPEYES Abay Plaza',
    city: 'almaty',
    address: 'мкр 4, Ауезовский р',
    cuisineTags: 'курица, бургер, халяль',
    ratingScore: 8.2,
    ratingCount: 2527,
    deliveryTimeMin: 30,
    longitude: 76.86,
    latitude: 43.22,
    slug: 'popeyes-abay-plaza',
    woltUrl: 'https://wolt.com/en/kaz/almaty/restaurant/popeyes-abay-plaza',
  };

  const mockMenuItem: MenuItem = {
    id: 1,
    menuCategory: 'Бургеры',
    itemName: 'Crispy Chicken Burger',
    description: 'Хрустящий бургер с курицей',
    priceKzt: 2200,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService],
    });
    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all restaurants without cuisine filter', () => {
    service.getAll().subscribe(restaurants => {
      expect(restaurants.length).toBe(1);
      expect(restaurants[0].name).toBe('POPEYES Abay Plaza');
    });

    const req = httpMock.expectOne(`${BASE}/restaurants`);
    expect(req.request.method).toBe('GET');
    req.flush([mockRestaurant]);
  });

  it('should fetch restaurants with cuisine filter appended to URL', () => {
    service.getAll('пицца').subscribe(restaurants => {
      expect(restaurants.length).toBe(1);
    });

    const req = httpMock.expectOne(`${BASE}/restaurants?cuisine=пицца`);
    expect(req.request.method).toBe('GET');
    req.flush([mockRestaurant]);
  });

  it('should return empty array when no restaurants match cuisine', () => {
    service.getAll('french').subscribe(restaurants => {
      expect(restaurants).toEqual([]);
    });

    const req = httpMock.expectOne(`${BASE}/restaurants?cuisine=french`);
    req.flush([]);
  });

  it('should fetch restaurant by id', () => {
    service.getById('abc123').subscribe(restaurant => {
      expect(restaurant.id).toBe('abc123');
      expect(restaurant.ratingScore).toBe(8.2);
    });

    const req = httpMock.expectOne(`${BASE}/restaurants/abc123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurant);
  });

  it('should fetch menu items for a restaurant', () => {
    service.getMenu('abc123').subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].itemName).toBe('Crispy Chicken Burger');
      expect(items[0].priceKzt).toBe(2200);
    });

    const req = httpMock.expectOne(`${BASE}/restaurants/abc123/menu`);
    expect(req.request.method).toBe('GET');
    req.flush([mockMenuItem]);
  });

  it('should return empty array when restaurant has no menu items', () => {
    service.getMenu('abc123').subscribe(items => {
      expect(items).toEqual([]);
    });

    const req = httpMock.expectOne(`${BASE}/restaurants/abc123/menu`);
    req.flush([]);
  });
});
