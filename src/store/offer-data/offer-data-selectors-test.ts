import { describe } from 'vitest';
import { getOffers } from './offer-data-selectors';
import { NameSpace } from '../../const';

describe('OfferData selectors', () => {
  const state = {
    [NameSpace.Data]: {
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
    }
  }
  const result = getOffers();
});