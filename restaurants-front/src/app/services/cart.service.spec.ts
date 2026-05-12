import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { MenuItem } from '../models/menu-item.model';

describe('CartService', () => {
  let service: CartService;

  const makeItem = (id: number, price: number): MenuItem => ({
    id,
    menuCategory: 'Бургеры',
    itemName: `Item ${id}`,
    description: '',
    priceKzt: price,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty cart', () => {
    expect(service.cartItems()).toEqual([]);
    expect(service.totalCount()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should add a new item with quantity 1', () => {
    service.add(makeItem(1, 2200), 'POPEYES');

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(service.totalCount()).toBe(1);
  });

  it('should increment quantity when adding same item twice', () => {
    const item = makeItem(1, 2200);
    service.add(item, 'POPEYES');
    service.add(item, 'POPEYES');

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.totalCount()).toBe(2);
  });

  it('should keep separate entries for different items', () => {
    service.add(makeItem(1, 2200), 'POPEYES');
    service.add(makeItem(2, 1500), 'KFC');

    expect(service.cartItems().length).toBe(2);
    expect(service.totalCount()).toBe(2);
  });

  it('should calculate total price correctly', () => {
    service.add(makeItem(1, 2200), 'POPEYES');
    service.add(makeItem(1, 2200), 'POPEYES');
    service.add(makeItem(2, 1500), 'KFC');

    expect(service.totalPrice()).toBe(2200 * 2 + 1500);
  });

  it('should decrement quantity when calling decrement', () => {
    const item = makeItem(1, 2200);
    service.add(item, 'POPEYES');
    service.add(item, 'POPEYES');
    service.decrement(1);

    expect(service.cartItems()[0].quantity).toBe(1);
  });

  it('should remove item when decrement brings quantity to zero', () => {
    service.add(makeItem(1, 2200), 'POPEYES');
    service.decrement(1);

    expect(service.cartItems()).toEqual([]);
    expect(service.totalCount()).toBe(0);
  });

  it('should remove item by id', () => {
    service.add(makeItem(1, 2200), 'POPEYES');
    service.add(makeItem(2, 1500), 'KFC');
    service.remove(1);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].menuItem.id).toBe(2);
  });

  it('should clear all items', () => {
    service.add(makeItem(1, 2200), 'POPEYES');
    service.add(makeItem(2, 1500), 'KFC');
    service.clear();

    expect(service.cartItems()).toEqual([]);
    expect(service.totalCount()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('should store restaurantName on cart item', () => {
    service.add(makeItem(1, 2200), 'POPEYES Abay Plaza');

    expect(service.cartItems()[0].restaurantName).toBe('POPEYES Abay Plaza');
  });
});
