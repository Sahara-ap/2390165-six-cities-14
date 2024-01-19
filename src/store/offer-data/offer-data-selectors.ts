import { createSelector } from '@reduxjs/toolkit';
import { LoadingDataStatus, NameSpace } from '../../const';
import { Favorite, Offer, SelectedOffer } from '../../types/offer';
import ReviewType from '../../types/review';
import { State } from '../../types/state';
import { OffersData } from '../../types/sliceTypes';

// const getOffers = (state: Pick<State, NameSpace.Data>): Offer[] => state[NameSpace.Data].offers;
// использую новый способ для создания селектора. Он позволяет дополнительно обрабатывать данные, которые получены из стейта стора
const getOffersSelector = (state: Pick<State, NameSpace.Data>): OffersData => state[NameSpace.Data];
const getOffers = createSelector([getOffersSelector], (stateData: OffersData) => stateData.offers);

const getSelectedOffer = (state: Pick<State, NameSpace.Data>): SelectedOffer | null => state[NameSpace.Data].selectedOffer;
const getNearPlaces = (state: Pick<State, NameSpace.Data>): Offer[] => state[NameSpace.Data].nearPlaces;
const getFavs = (state: Pick<State, NameSpace.Data>): Favorite[] => state[NameSpace.Data].favs;

//получаю отсортированные по дате список Review
const getReviews = (state: Pick<State, NameSpace.Data>): ReviewType[] => state[NameSpace.Data].reviews;
const getSortedReviews = createSelector([getReviews], (reviews:ReviewType[]) => reviews.slice()
  .sort((reviewA, reviewB) => Date.parse(reviewB.date) - Date.parse(reviewA.date)));


const getReviewStatusSending = (state: Pick<State, NameSpace.Data>): LoadingDataStatus => state[NameSpace.Data].reviewStatusSending;
const getIsOffersLoading = (state: Pick<State, NameSpace.Data>): boolean => state[NameSpace.Data].isOffersLoading;
const getOfferDataStatusSending = (state: Pick<State, NameSpace.Data>): LoadingDataStatus => state[NameSpace.Data].offerDataStatusSending;
const getFavLoadingStatus = (state: Pick<State, NameSpace.Data>): LoadingDataStatus => state[NameSpace.Data].favsLoadingStatus;
const getErrorStatus = (state: Pick<State, NameSpace.Data>): boolean => state[NameSpace.Data].hasError;


export {
  getOffers,
  getSelectedOffer,
  getNearPlaces,
  getReviews,
  getFavs,
  getSortedReviews,


  getReviewStatusSending,
  getIsOffersLoading,
  getOfferDataStatusSending,
  getFavLoadingStatus,
  getErrorStatus,
};
