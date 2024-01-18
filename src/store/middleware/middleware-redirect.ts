import { Middleware, PayloadAction } from '@reduxjs/toolkit';
import rootReducer from '../root-reducer';
import browserHistory from '../../browser-history';


type Reducer = ReturnType<typeof rootReducer>

const middlewareRedirect: Middleware<unknown, Reducer> =
  () => (next) => (action: PayloadAction<string>) => {
    if (action.type === 'app/redirectToRoute') {
      browserHistory.push(action.payload);
    }

    return next(action);
  };

export {
  middlewareRedirect,
};

