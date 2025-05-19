import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { CartService } from './cart.service';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('CartService', () => {
  let spectator: SpectatorService<CartService>;
  const createService = createServiceFactory(CartService);

  beforeEach(() => (spectator = createService()));

  it('should create the service', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should add a product to the cart', () => {
    const mockProduct = generateFakeProduct();
    spectator.service.addToCart(mockProduct);
    expect(spectator.service.cart()).toEqual([mockProduct]);
    expect(spectator.service.total()).toEqual(mockProduct.price);
  });

  describe('cart operations', () => {
    const mockProduct1 = generateFakeProduct({ price: 10 });
    const mockProduct2 = generateFakeProduct({ price: 20 });

    it('should return an empty cart initially', () => {
      expect(spectator.service.cart()).toEqual([]);
      expect(spectator.service.total()).toEqual(0);
    });
    it('should add a product to the cart', () => {
      spectator.service.addToCart(mockProduct1);
      expect(spectator.service.cart()).toEqual([mockProduct1]);
      expect(spectator.service.total()).toBe(10);
    });
    it('should add multiple products to the cart', () => {
      spectator.service.addToCart(mockProduct1);
      spectator.service.addToCart(mockProduct2);

      expect(spectator.service.cart()).toHaveLength(2);
      expect(spectator.service.cart()).toEqual([mockProduct1, mockProduct2]);
      expect(spectator.service.total()).toBe(30);
    });
    it('should handle adding products with zero price', () => {
      const zeroProduct = generateFakeProduct({ price: 0 });
      spectator.service.addToCart(zeroProduct);

      expect(spectator.service.cart()).toHaveLength(1);
      expect(spectator.service.total()).toBe(0);
    });
    it('should handle adding products with negative price', () => {
      const negativeProduct = generateFakeProduct({ price: -10 });
      spectator.service.addToCart(negativeProduct);

      expect(spectator.service.cart()).toHaveLength(1);
      expect(spectator.service.total()).toBe(-10);
    });
  });
});
