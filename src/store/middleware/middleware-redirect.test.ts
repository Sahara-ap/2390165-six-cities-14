import { MockStore, configureMockStore } from '@jedmao/redux-mock-store';
import { middlewareRedirect } from './middleware-redirect';
import browserHistory from '../../browser-history';
import { AnyAction } from '@reduxjs/toolkit';
import { State } from '../../types/state';
import { redirectToRoute } from '../actions/actions';
import { AppRoute } from '../../const';

//Создадим заглушку для всего модуля. Cb - фабричная функция, возвращающая объект
//  с частичной структурой экземпляра класса browserHistory
vi.mock('../../browser-history.ts', () => ({
  default: {
    location: { pathname: '' },
    push(path: string) {
      this.location.pathname = path;
    }
  }
}));

describe('Redirect middleware', () => {
  let store: MockStore; //не импортируем стор, а имитируем (мокаем) с помощью пакета redux-mock-store

  //cb будет запущен один раз в начале перед всеми тестами
  beforeAll(() => {
    const middleware = [middlewareRedirect]; //предали массив из mw, в нашем случае один mw
    const mockStoreCreator = configureMockStore<State, AnyAction>(middleware);
    store = mockStoreCreator();
  });

  // cb будет запущен перед выполнением каждого! теста
  beforeEach(() => {
    browserHistory.push(''); //очищаем текущий location.pathname перед каждым тестом
  });

  //позитивный сценарий
  it('should redirect to "/" with redirectToRoute action', () => {
    const redirectAction = redirectToRoute(AppRoute.Main); //помним что redirectToRoute это функция которая создает одноименный объект action = {type, payload}
    store.dispatch(redirectAction);
    expect(browserHistory.location.pathname).toBe(AppRoute.Main);
  });

  //негативный сценарий
  //  Если мы не используем action  redirectToRoute то никакого перенаправления не случится
  it('should not redirect to "/lose" with empty action', () => {
    const emptyAction = {type: '', payload: AppRoute.Lose};
    store.dispatch(emptyAction);
    expect(browserHistory.location.pathname).not.toBe(AppRoute.Lose);
  });
});
