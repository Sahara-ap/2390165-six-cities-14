import { ActiveCity } from './types/city';

enum APIRoute {
  Offers = '/offers',
  Login = '/login',
  Logout = '/logout',
  SelectedOffer = '/offers/',
  Reviews = '/comments/',
  Favorite = '/favorite',
}

enum AppRoute {
  Main = '/',
  Login = '/login',
  Favorite = '/favorites',
  Offer = '/offer/',
  NotFound = '/*',

  Lose = '/lose',
}

enum AuthStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

const CITY_NAMES: ActiveCity[] = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'];

enum LoadingDataStatus {
  Unsent = 'UNSENT',
  Pending = 'PENDING',
  Success = 'SUCCESS',
  Error = 'ERROR',
}

enum NameSpace {
  Data = 'DATA',
  App = 'APP',
  User = 'USER',
}

const TIMEOUT_SHOW_ERROR = 2000;

const URL_MARKER_DEFAULT =
  '../markup/img/pin.svg';

const URL_MARKER_CURRENT =
  '../markup/img/pin-active.svg';


export {
  APIRoute,
  AppRoute,
  AuthStatus,
  CITY_NAMES,
  LoadingDataStatus,
  NameSpace,
  TIMEOUT_SHOW_ERROR,
  URL_MARKER_DEFAULT,
  URL_MARKER_CURRENT,
};
