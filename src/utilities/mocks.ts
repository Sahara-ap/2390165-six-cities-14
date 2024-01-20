import { faker } from '@faker-js/faker';

import { CITY_NAMES } from '../const';
import { pickRandomElement } from './utilities';

import { Offer, SelectedOffer } from '../types/offer';
import Host from '../types/host';
import ReviewType from '../types/review';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { createAPI } from '../services/apiService/api';
import { State } from '../types/state';
import { UserData } from '../types/user-data';

const makeFakeLocation = () => ({
  latitude: faker.number.float({ min: 0, max: 180, precision: 0.000001 }),
  longitude: faker.number.float({ min: 0, max: 180, precision: 0.000001 }),
  zoom: faker.number.int(),
});

const makeFakeHost = (): Host => ({
  id: faker.number.int(),
  name: faker.person.fullName(),
  isPro: true,
  avatarUrl: faker.internet.url(),
});

const makeFakeUserData = (): UserData => ({
  name: faker.person.fullName(),
  avatarUrl: faker.internet.url(),
  isPro: true,
  email: faker.internet.email(),
  token: 'secret',
});

const makeFakeOffers = (): Offer[] => new Array(3).fill(null).map(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.lines(1),
  type: 'apartment',
  price: faker.number.int(),
  previewImage: faker.image.url(),
  city: {
    location: makeFakeLocation(),
    name: pickRandomElement(CITY_NAMES),
  },
  location: makeFakeLocation(),
  isFavorite: true,
  isPremium: true,
  rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
}));

const makeFakeSelectedOffer = (): SelectedOffer => ({
  id: faker.string.uuid(),
  title: faker.lorem.lines(1),
  type: 'apartment',
  price: faker.number.int(),
  city: {
    location: makeFakeLocation(),
    name: pickRandomElement(CITY_NAMES),
  },
  location: makeFakeLocation(),
  isFavorite: true,
  isPremium: true,
  rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
  description: faker.lorem.lines(1),
  bedrooms: faker.number.int(),
  goods: [faker.lorem.lines(1)],
  host: makeFakeHost(),
  images: [faker.internet.url()],
  maxAdults: faker.number.int(),
});

const makeFakeReviews = (): ReviewType[] => {
  const result = new Array(3).fill(null).map(() => ({
    id: faker.string.uuid(),
    date: faker.string.numeric(),
    user: makeFakeHost(),
    comment: faker.lorem.lines(1),
    rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
  }));
  return result;
};

export type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;
const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);

export {
  makeFakeLocation,
  makeFakeHost,
  makeFakeUserData,
  makeFakeOffers,
  makeFakeSelectedOffer,
  makeFakeReviews,
  extractActionsTypes,
};
