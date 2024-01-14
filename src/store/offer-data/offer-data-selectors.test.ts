import { describe } from 'vitest';
import { getOffers } from './offer-data-selectors';
import { LoadingDataStatus, NameSpace } from '../../const';

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
  };

  it('should return offers from state', () => {
    const result = getOffers(state);
    expect(result).toEqual([]);
  });


});
