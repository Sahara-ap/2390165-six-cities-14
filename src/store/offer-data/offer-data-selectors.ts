import { LoadingDataStatus, NameSpace } from '../../const';
import { Favorite, Offer, SelectedOffer } from '../../types/offer';
import ReviewType from '../../types/review';
import { State } from '../../types/state';

const getOffers = (state: Pick<State, NameSpace.Data>): Offer[] => state[NameSpace.Data].offers;
const getSelectedOffer = (state: Pick<State, NameSpace.Data>): SelectedOffer | null => state[NameSpace.Data].selectedOffer;
const getNearPlaces = (state: Pick<State, NameSpace.Data>): Offer[] => state[NameSpace.Data].nearPlaces;
const getReviews = (state: Pick<State, NameSpace.Data>): ReviewType[] => state[NameSpace.Data].reviews;
const getFavs = (state: Pick<State, NameSpace.Data>): Favorite[] => state[NameSpace.Data].favs;

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


  getReviewStatusSending,
  getIsOffersLoading,
  getOfferDataStatusSending,
  getFavLoadingStatus,
  getErrorStatus,
};
