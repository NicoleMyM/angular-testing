import { faker } from '@faker-js/faker';
import { Product } from './product.model';
import { generateFakeCategory } from './category.mock';

export const generateFakeProduct = (data?: Partial<Product>): Product => ({
  id: faker.number.int(),
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  images: [faker.image.url(), faker.image.url()],
  category: generateFakeCategory(),
  creationAt: faker.date.past().toISOString(),
  slug: faker.lorem.slug(),
  ...data,
});
