import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';

import { APIRoute, AppRoute, TIMEOUT_SHOW_ERROR } from '../const';
import { dropToken, saveToken } from '../services/apiService/token';

import { AppDispatch, ThunkAPI } from '../types/state';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { Favorite, Offer, SelectedOffer } from '../types/offer';
import ReviewType, { CommentSend } from '../types/review';
import { setError } from './app-process/app-process-slice';
import { addFavOffer, dropAllFavorites, dropFavOffer, updateNearPlaces, updateOffers } from './offer-data/offer-data-slice';
import { redirectToRoute } from './actions/actions';


const fetchOffersAction = createAsyncThunk<Offer[], undefined, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'data/fetchOffers',
  async (_arg, { extra: api, }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);

    return data;
  }
);

const fetchFavoritesAction = createAsyncThunk<Favorite[], undefined, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'data/fetchFavs',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Favorite[]>(APIRoute.Favorite);
    return data;
  }
);

type SelectedOfferData = [SelectedOffer, Offer[], ReviewType[]]

const fetchSelectedOfferDataAction = createAsyncThunk<SelectedOfferData, string, {
  extra: AxiosInstance;
}>(
  'data/fetchSelectedOfferData',
  async (offerId, { extra: api }) => {
    const offerPath = APIRoute.SelectedOffer + offerId;
    const nearbyPath = `${APIRoute.SelectedOffer}${offerId}/nearby`;
    const commentsPath = APIRoute.Reviews + offerId;

    const [{data: selectedOffer}, {data: nearbyOffers}, {data: comments}] = await Promise.all(
      [
        api.get<SelectedOffer>(offerPath),
        api.get<Offer[]>(nearbyPath),
        api.get<ReviewType[]>(commentsPath),
      ]
    );
    return [selectedOffer, nearbyOffers, comments];

  }
);

const postCommentAction = createAsyncThunk<
  ReviewType,
  { reviewData: CommentSend; offerId: string | undefined },
  { dispatch: AppDispatch; extra: AxiosInstance }
>('user/postReview',
  async ({ reviewData, offerId }, {extra: api }) => {

    const path = APIRoute.Reviews + offerId;
    const { data } = await api.post<ReviewType>(path, reviewData);
    return data;
  }
);


const postFavStatusAction = createAsyncThunk<
  Offer,
  { offerId: string | undefined; status: number; elementType?: string }, ThunkAPI
>('user/postFavStatus',
  async ({ offerId, status, elementType }, { dispatch, extra: api }) => {
    const path = `${APIRoute.Favorite}/${offerId}/${status}`;
    const { data } = await api.post<Favorite>(path);

    if (status === 0) {
      dispatch(dropFavOffer(data));
    } else {
      dispatch(addFavOffer(data));
    }

    if (elementType === 'offers') {
      dispatch(updateNearPlaces(data));
    } else {
      dispatch(updateOffers(data));
    }


    return data;

  }
);

const checkAuthAction = createAsyncThunk<UserData, undefined, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>('user/checkAuth',
  async (_arg, { dispatch, extra: api }) => {
    const { data } = await api.get<UserData>(APIRoute.Login);
    if (data) {
      dispatch(fetchFavoritesAction());
    }

    return data;
  });

const loginAction = createAsyncThunk<UserData, AuthData, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>('user/login',
  async ({ email, password }, { dispatch, extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });
    if (data) {
      const token = data.token;
      saveToken(token);

      dispatch(fetchOffersAction());
      dispatch(fetchFavoritesAction());

      // редирект через action и собственный middlware в случае успешной авторизации
      //  на LoginPage есть строка №36 где используется навигация в случае если user авторизован и данный диспатч дублирует логику
      //  но важно понять логику редиректа.
      //  Если на LoginPage отключить навигацию, эта строчка сработает!
      dispatch(redirectToRoute(AppRoute.Main));
    }
    return data;
  });

const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>('user/logout',
  async (_arg, { dispatch, extra: api }) => {
    await api.delete(APIRoute.Logout);
    dropToken();
    dispatch(fetchOffersAction());
    dispatch(dropAllFavorites());
  });

const clearErrorAction = createAsyncThunk('app/clearError',
  (_arg, { dispatch }) => {
    setTimeout(
      () => dispatch(setError(null)), TIMEOUT_SHOW_ERROR);
  });


export {
  fetchOffersAction,
  fetchFavoritesAction,
  fetchSelectedOfferDataAction,
  postCommentAction,
  postFavStatusAction,
  checkAuthAction,
  loginAction,
  logoutAction,
  clearErrorAction,
};
