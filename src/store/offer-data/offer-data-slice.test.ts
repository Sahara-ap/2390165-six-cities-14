import { LoadingDataStatus } from '../../const';
import { makeFakeOffers, makeFakeReviews } from '../../utilities/mocks';
import { fetchOffersAction } from '../api-actions';
import { isReviewSending, offersData, setReviews } from './offer-data-slice';

describe('offerData Slice', () => {
  const initialState = {
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

  //тестируем редьюсер в целом
  //редьюсер возвращает текущий стейт если передан пустой action:
  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const expectedState = {
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

    const result = offersData.reducer(expectedState, emptyAction);
    expect(result).toEqual(expectedState);
  });

  //редьюсер возвращает initial state если стейт не передан + action пустой
  it('should return initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const expectedState = initialState;
    const result = offersData.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  //тестируем actions от reducers
  //проверяем что редьюсер меняет верное поле в стейте в зависимости от переданного action
  it('should update "reviewStatusSending" with payload of "isReviewSending" action', () => {
    const expectedReviewStatusSending = LoadingDataStatus.Success;
    const result = offersData.reducer(initialState, isReviewSending(LoadingDataStatus.Success));

    expect(result.reviewStatusSending).toEqual(expectedReviewStatusSending);
  });

  it('should set "reviews" to  payloadValue with "setReviews" action', () => {
    const expectedReviews = makeFakeReviews();
    const result = offersData.reducer(initialState, setReviews(expectedReviews));

    expect(result.reviews).toEqual(expectedReviews);
  });

  //тестируем actions от extraReducers
  //тестируем action "fetchOffersAction"

  it('should set "isOffersLoading" to "true", "hasError" to "false" with fetchOffersAction.pending', () => {
    const expectedIsOffersLoading = true;
    const expectedHasError = false;

    const result = offersData.reducer(undefined, fetchOffersAction.pending);

    expect(result.isOffersLoading).toBe(expectedIsOffersLoading);
    expect(result.hasError).toBe(expectedHasError);
  });

  it('should set "isOffersLoading" to "false", "hasError" to "true" with fetchOffersAction.rejected', () => {
    const expectedIsOffersLoading = false;
    const expectedHasError = true;

    const result = offersData.reducer(undefined, fetchOffersAction.rejected);

    expect(result.isOffersLoading).toBe(expectedIsOffersLoading);
    expect(result.hasError).toBe(expectedHasError);
  });

  it('should set "offers" to array, "isOffersLoading" to "false", "hasError" to "false" with fetchOffersAction.fulfilled', () => {
    const expectedIsOffersLoading = false;
    const expectedHasError = false;
    const expectedOffers = makeFakeOffers();

    const result = offersData.reducer(undefined, fetchOffersAction.fulfilled(expectedOffers, '', undefined));

    expect(result.isOffersLoading).toBe(expectedIsOffersLoading);
    expect(result.hasError).toBe(expectedHasError);
    expect(result.offers).toEqual(expectedOffers);
  });

});
