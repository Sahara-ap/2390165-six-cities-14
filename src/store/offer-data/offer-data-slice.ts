import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoadingDataStatus, NameSpace } from '../../const';
import { fetchFavoritesAction, fetchOffersAction, fetchSelectedOfferDataAction, postCommentAction, postFavStatusAction } from '../api-actions';
import { OffersData } from '../../types/sliceTypes';
import ReviewType from '../../types/review';
import { Offer } from '../../types/offer';


const initialState: OffersData = {
  offers: [],
  hasError: false,
  isOffersLoading: false,

  selectedOffer: null,
  nearPlaces: [],
  reviews: [],
  offerDataStatusSending: LoadingDataStatus.Unsent,


  reviewStatusSending: LoadingDataStatus.Unsent,

  favs: [],
  favsLoadingStatus: LoadingDataStatus.Unsent
};

const offersData = createSlice({
  name: NameSpace.Data,
  initialState,
  reducers: {
    isReviewSending: (state, action: PayloadAction<LoadingDataStatus>) => {
      state.reviewStatusSending = action.payload;
    },
    setReviews: (state, action: PayloadAction<ReviewType[]>) => {
      state.reviews = action.payload;
    },

    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },

    updateNearPlaces: (state, action: PayloadAction<Offer>) => {
      const nearOffers = state.nearPlaces.map((it) => {
        if (it.id === action.payload.id) {
          it.isFavorite = !it.isFavorite;
        }
        return it;
      });

      state.nearPlaces = nearOffers;
    },

    dropFavOffer: (state, action: PayloadAction<Offer>) => {
      const index = state.favs.findIndex((offer) => offer.id === action.payload.id);
      state.favs.splice(index, 1);
    },
    addFavOffer: (state, action: PayloadAction<Offer>) => {
      state.favs.push(action.payload);
    },
    updateOffers: (state, action: PayloadAction<Offer>) => {
      const offer = action.payload;

      const offers = state.offers.map((it: Offer) => {
        if (it.id === offer.id) {
          it.isFavorite = !it.isFavorite;
        }

        return it;
      });

      state.offers = offers;
    },
    dropAllFavorites: (state) => {
      state.favs = [];
    }

  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersLoading = true;
        state.hasError = false;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersLoading = false;
        state.hasError = false;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersLoading = false;
        state.hasError = true;
      })

      .addCase(fetchSelectedOfferDataAction.pending, (state) => {
        state.offerDataStatusSending = LoadingDataStatus.Pending;
      })
      .addCase(fetchSelectedOfferDataAction.fulfilled, (state, action) => {
        const [selectedOffer, nearbyOffers, comments] = action.payload;
        state.selectedOffer = selectedOffer;
        state.nearPlaces = nearbyOffers;
        state.reviews = comments;

        state.offerDataStatusSending = LoadingDataStatus.Success;
      })
      .addCase(fetchSelectedOfferDataAction.rejected, (state) => {
        state.offerDataStatusSending = LoadingDataStatus.Error;
      })

      .addCase(postCommentAction.pending, (state) => {
        state.reviewStatusSending = LoadingDataStatus.Pending;
      })
      .addCase(postCommentAction.fulfilled, (state, action) => {
        state.reviewStatusSending = LoadingDataStatus.Success;
        state.reviews.push(action.payload);
      })
      .addCase(postCommentAction.rejected, (state) => {
        state.reviewStatusSending = LoadingDataStatus.Error;
      })

      .addCase(fetchFavoritesAction.pending, (state) => {
        state.favsLoadingStatus = LoadingDataStatus.Pending;
      })
      .addCase(fetchFavoritesAction.fulfilled, (state, action) => {
        state.favsLoadingStatus = LoadingDataStatus.Success;
        state.favs = action.payload;
      })
      .addCase(fetchFavoritesAction.rejected, (state) => {
        state.favsLoadingStatus = LoadingDataStatus.Error;
      })
      .addCase(postFavStatusAction.fulfilled, (state) => {
        state.favsLoadingStatus = LoadingDataStatus.Success;

      });
  }
});

const { updateOffers, dropAllFavorites, isReviewSending, setReviews, setOffers, dropFavOffer, addFavOffer, updateNearPlaces } = offersData.actions;

export {
  offersData,
  updateOffers,
  dropAllFavorites,

  isReviewSending,
  setReviews,

  setOffers,
  dropFavOffer,
  addFavOffer,
  updateNearPlaces,
};
