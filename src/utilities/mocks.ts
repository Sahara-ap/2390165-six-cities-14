import { faker } from '@faker-js/faker';

const makeFakeOffers = new Array(4).fill(1).map((value) => ({
  id: faker.string.uuid(),
  title: string,
  type: string,
  price: number,
  previewImage?: string,
  city: City,
  location: Loc,
  isFavorite: boolean,
  isPremium: boolean,
  rating: number,


}));
