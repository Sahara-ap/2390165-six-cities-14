/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createReducer } from '@reduxjs/toolkit';

// import offers from '../mocks/offers';
import { fetchFavs, fetchNearPlaces, fetchSelectedOffer, fetchOffers, fetchReviews, isLoaded, setCity, setOffers, isSelectedOfferLoaded, isFavsLoaded, isNearPlacesLoaded, isReviewsLoaded, favoritesNumber } from './actions';
import { ActiveCity } from '../types/city';
import { Favs, NearOffer, Offer, SelectedOffer } from '../types/offer';
import ReviewType from '../types/review';

type InitialState = {
  activeCity: ActiveCity;
  favoritesNumber: number;
  offers: Array<Offer>;
  isLoaded: boolean;
  selectedOffer: SelectedOffer | null;
  isSelectedOfferLoaded: boolean;
  favs: Favs[];
  isFavsLoaded: boolean;
  nearPlaces: NearOffer[];
  isNearPlacesLoaded: boolean;
  reviews: ReviewType[];
  isReviewsLoaded: boolean;
}
const initialState: InitialState = {
  activeCity: 'Paris',
  favoritesNumber: 0,
  offers: [],
  isLoaded: false,
  selectedOffer: null,
  isSelectedOfferLoaded: false,
  favs: [],
  isFavsLoaded: false,
  nearPlaces: [],
  isNearPlacesLoaded: false,
  reviews: [],
  isReviewsLoaded: false,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setCity, (state, action) => {
      const { city } = action.payload;
      state.activeCity = city;
    })
    .addCase(favoritesNumber, (state, action) => {
      state.favoritesNumber = state.favoritesNumber + action.payload;
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload.offers;
    })
    .addCase(isLoaded, (state) => {
      state.isLoaded = true;
    })
    .addCase(fetchOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(fetchSelectedOffer, (state, action) => {
      state.selectedOffer = action.payload;
    })
    .addCase(isSelectedOfferLoaded, (state) => {
      state.isSelectedOfferLoaded = true;
    })
    .addCase(fetchFavs, (state, action) => {
      state.favs = action.payload;
    })
    .addCase(isFavsLoaded, (state) => {
      state.isFavsLoaded = true;
    })
    .addCase(fetchNearPlaces, (state, action) => {
      state.nearPlaces = action.payload;
    })
    .addCase(isNearPlacesLoaded, (state) => {
      state.isNearPlacesLoaded = true;
    })
    .addCase(fetchReviews, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(isReviewsLoaded, (state) => {
      state.isReviewsLoaded = true;
    });
});


export default reducer;

