import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/main-page/main-page';
import LoginPage from './pages/login-page/login-page';
import FavoritePage from './pages/favorite-page/favorite-page';
import OfferPage from './pages/offer-page/offer-page';
import NotFound from './pages/404-page/404-page';
import PrivateRoute from './components/private-route/private-route';
import { HelmetProvider } from 'react-helmet-async';

import { AppRoute } from './const';
import Layout from './components/layout/layout';
import ScrollToTop from './components/scroll-to-top/scroll-to-top';
import { useAppDispatch, useAppSelector } from './hooks';
import { getErrorStatus } from './store/offer-data/offer-data-selectors';
import Error from './pages/error/error';
import { useEffect } from 'react';
import { checkAuthAction } from './store/api-actions';
import HistoryRouter from './components/history-route/history-route';
import browserHistory from './browser-history';


function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const hasError = useAppSelector(getErrorStatus);

  useEffect(() => {
    dispatch(checkAuthAction());
  }, [dispatch]);

  if (hasError) {
    return (
      <Error />);
  }
  return (
    <HelmetProvider>
      <HistoryRouter history={browserHistory} >
        <ScrollToTop />
        <Routes>
          <Route path={'/'} element={<Layout />} >
            <Route path={AppRoute.Main} element={<MainPage />} />

            <Route path={AppRoute.Favorite} element={
              <PrivateRoute redirectTo={AppRoute.Login} >
                <FavoritePage />
              </PrivateRoute>
            }
            />
            <Route path={AppRoute.Offer}>
              <Route index element={<OfferPage />} />
              <Route path={':offerId'} element={<OfferPage />} />
            </Route>
            <Route path={AppRoute.NotFound} element={<NotFound />} />
          </Route>
          <Route path={AppRoute.Login} element={<LoginPage />} />
        </Routes>
      </HistoryRouter>
    </HelmetProvider >

  );
}

export default App;
