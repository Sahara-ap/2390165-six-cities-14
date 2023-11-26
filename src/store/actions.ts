/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createAction } from '@reduxjs/toolkit';
import { ActiveCity } from '../types/city';
import { Favs, NearOffer, Offer, SelectedOffer } from '../types/offer';
import ReviewType from '../types/review';

const setCity = createAction<{ city: ActiveCity }>('setCity');

const setOffers = createAction('setOffers', (value) => (
  {
    payload: {
      offers: value,
    }
  }
));
const favoritesNumber = createAction<number>('favoritesNumber');

const fetchOffers = createAction<Offer[]>('fetchOffers');
const isLoaded = createAction('loaded');

const fetchSelectedOffer = createAction<SelectedOffer>('fetchOffer');
const isSelectedOfferLoaded = createAction('selectedOfferLoaded');
const fetchFavs = createAction<Favs[]>('fetchFavs');
const isFavsLoaded = createAction('favsLoaded');
const fetchNearPlaces = createAction<NearOffer[]>('fetchNearPlaces');
const isNearPlacesLoaded = createAction('nearPlacesLoaded');
const fetchReviews = createAction<ReviewType[]>('fetchReviews');
const isReviewsLoaded = createAction('reviewsLoaded');


export {
  setCity,
  setOffers,
  favoritesNumber,
  fetchOffers,
  isLoaded,
  fetchSelectedOffer,
  isSelectedOfferLoaded,
  fetchFavs,
  isFavsLoaded,
  fetchNearPlaces,
  isNearPlacesLoaded,
  fetchReviews,
  isReviewsLoaded
};
