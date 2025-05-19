import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CategoryService } from './category.service';
import { generateFakeCategory } from '@shared/models/category.mock';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getAll', () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it('should fetch all categories successfully', () => {
      const mockCategories = [generateFakeCategory(), generateFakeCategory()];

      spectator.service.getAll().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      //expect(req.request.method).toBe('GET');
      req.flush(mockCategories);
    });

    it('should handle an empty category list', () => {
      spectator.service.getAll().subscribe(categories => {
        expect(categories).toEqual([]);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      //expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle an error response', () => {
      const errorMessage = 'Failed to fetch categories';

      spectator.service.getAll().subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      //expect(req.request.method).toBe('GET');
      req.flush(null, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });

  describe('getAllPromise', () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it('should fetch all categories successfully using promises', async () => {
      const mockCategories = [generateFakeCategory(), generateFakeCategory()];

      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockCategories),
        } as Response)
      );

      const categories = await spectator.service.getAllPromise();
      expect(categories).toEqual(mockCategories);
      expect(global.fetch).toHaveBeenCalledWith(url);
    });

    it('should handle an empty category list using promises', async () => {
      const mockCategories: Category[] = [];
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockCategories),
        } as Response)
      );

      const categories = await spectator.service.getAllPromise();
      expect(categories).toEqual([]);
      expect(global.fetch).toHaveBeenCalledWith(url);
    });

    it('should handle a network error using promises', async () => {
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockRejectedValueOnce(new Error('Network Error'));

      /*await expect(spectator.service.getAllPromise()).rejects.toThrow(
        'Network Error'
      );*/
      expect(fetchSpy).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });
  });
});
