import { describe } from 'vitest';
import { getErrorStatus, getIsOffersLoading, getOffers, getSelectedOffer, getSortedReviews } from './offer-data-selectors';
import { LoadingDataStatus, NameSpace } from '../../const';
import { makeFakeOffers, makeFakeSelectedOffer } from '../../utilities/mocks';

describe('OfferData selectors', () => {
  const mockOffers = makeFakeOffers();
  const mockSelectedOffer = makeFakeSelectedOffer();
  const state = {
    [NameSpace.Data]: {
      offers: mockOffers,
      hasError: false,
      isOffersLoading: false,

      selectedOffer: mockSelectedOffer,
      nearPlaces: [],
      reviews: [],
      offerDataStatusSending: LoadingDataStatus.Unsent,


      reviewStatusSending: LoadingDataStatus.Unsent,

      favs: [],
      favsLoadingStatus: LoadingDataStatus.Unsent
    }
  };

  it('should return "offers" from state', () => {
    const {offers} = state[NameSpace.Data];
    const result = getOffers(state);
    expect(result).toEqual(offers);
  });

  it('should return sortedReviews from state', () => {
    const {reviews} = state[NameSpace.Data];
    const result = getSortedReviews(state);
    expect(result).toEqual(reviews);
  });

  it('should return hasError from state', () => {
    const {hasError} = state[NameSpace.Data];
    const result = getErrorStatus(state);
    expect(result).toBe(hasError);
  });

  it('should return isOffersLoading from state', () => {
    const {isOffersLoading} = state[NameSpace.Data];
    const result = getIsOffersLoading(state);
    expect(result).toBe(isOffersLoading);
  });

  it('should return "selectedOffer" from state', () => {
    const {selectedOffer} = state[NameSpace.Data];
    const result = getSelectedOffer(state);
    expect(result).toEqual(selectedOffer);
  });


});
