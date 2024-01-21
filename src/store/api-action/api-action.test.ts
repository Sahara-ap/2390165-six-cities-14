// Тактика
//  1. Были ли произведены соответствующие actions
//  2. Были ли выполнены все dispatch
// Сетевое взаимодействие исключаем
//  Создать мок для axios
//  Замокать сам стор

import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { createAPI } from '../../services/apiService/api';
import * as tokenStorage from '../../services/apiService/token';
import { checkAuthAction, fetchFavoritesAction, fetchOffersAction, loginAction, logoutAction } from './api-actions';
import { redirectToRoute } from '../actions/actions';
import { makeFakeOffers, makeFakeUserData } from '../../utilities/mocks';
import { APIRoute } from '../../const';
import { dropAllFavorites } from '../offer-data/offer-data-slice';
import { AuthData } from '../../types/auth-data';
import { UserData } from '../../types/user-data';
import { State } from '../../types/state';

type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>
const extractActionsTypes = (actions: Action<string>[]) => actions.map((action) => action.type);

describe('Async actions', () => {
  // Шаг1. мокаем axios с использованием библиотеки axios-mock-adapter
  //  позволяет подменить настоящие запросы к серверу
  const api = createAPI(); //создан экземпляр axios
  //UPD! vitest видит внутри интерсептора функцию processErrorHandle, где реализован диспатч экшенов в стор и
  //выдает ошибку на тест. Решение: либо комментить processErrorHandle, либо использовать toast, либо создавать здесь свой axios.create()
  //UPD2 вместо processErrorHandle в response-interceptor затащил react-toastify


  const mockAxiosAdapter = new MockAdapter(api); //скормили экземпляр в адаптер, пропатчив его таким образом

  //Шаг2. мокаем стор
  const middleware = [thunk.withExtraArgument(api)]; //соберем все middleware в кучу:
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware); //конфигурируем сам стор при помощи известного нам redux-mock-store от @jedmao
  let store: ReturnType<typeof mockStoreCreator>;

  // перед каждым тестом необходимо обнулять стор, чтобы тесты не падали
  //  Если не пересоздавать в сторе сохранялась бы вся!! история actions --> тесты падали
  beforeEach(() => {
    store = mockStoreCreator({
      DATA: { offers: [] },
      USER: {},
      APP: {},
    });
  });

  describe('checkAuthAction', () => {
    //Тестим checkAuthAction
    //  у нас имитация сетевого взаимодействия поэтому будем передавать асс коллбэк
    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" with thunk "checkAuthAction',
      async () => {
        //Донастроим адаптер, указав какие данные мы хотим получать
        //  onGet - ручка сервера; reply - ответ сервера. Превый аргумент-код, второй-данные, третий-заголовки
        //  готовим обязательно фейковый ответ (мокаем ответ сервера), т.к. внутри санок есть блок if(data)
        //    он не нужный и даже вредный, но для примера обработки хорошо. Если данные не положить в reply(200, data)
        //    fetchFavoritesAction - не войдет в список в рамках теста, а нам надо сохранить историю действий внутри санок
        const fakeResponseData: UserData = makeFakeUserData();
        mockAxiosAdapter.onGet(APIRoute.Login).reply(200, fakeResponseData);

        await store.dispatch(checkAuthAction());

        //Были ли выполнены все dispatch
        //  store.getActions() дает нам список всех actions, которые есть в этом store
        //  + всякие ненужные данные, поэтому мы создаем функцию, которая извлечет типы действий из объекта,
        //  который нам возвращает метод
        const actionTypes = extractActionsTypes(store.getActions());

        // мы убеждаемя что при диспатче checkAuthAction у нас выполняются некоторые
        //  диспатчи автоматом и эти диспатчи должны совпадать с тем, что в toEqual([])

        expect(actionTypes).toEqual([
          checkAuthAction.pending.type,
          fetchFavoritesAction.pending.type,
          checkAuthAction.fulfilled.type,
        ]);
      });
  });
  //негативный сценарий при котором проверяем авто экшены, если сервер ответил ошибкой 400
  it('should dispatch "checkAuthAction.pending" and "checkAuthAction.rejected" when server response 400 with thunk "checkAuthAction',
    async () => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(400);
      await store.dispatch(checkAuthAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type, // 'user/checkAuth/pending'
        checkAuthAction.rejected.type // 'user/checkAuth/rejected'
      ]);
    });

  // группа тестов для санок, где с сервера получаем данные и диспатчим их в стор
  describe('fetchOffers', () => {
    //Позитивный сценарий. Сервер ответил 200
    //два в одном 1)тестим что автоматом дисатчнулись action.pending и action.fulfilled
    //  2) данные которые вернул сервер соответствуют ожидаемым (моковым)
    it('should dispatch "fetchOffersAction.pending", "fetchOffersAction.fulfilled", when server response 200',
      async () => {
        const mockOffers = makeFakeOffers();
        mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

        await store.dispatch(fetchOffersAction());
        const emittedActions = store.getActions();
        const extractedActionTypes = extractActionsTypes(emittedActions);
        const fetchOffersActionFulfilled = emittedActions.at(1) as ReturnType<typeof fetchOffersAction.fulfilled>;


        expect(extractedActionTypes).toEqual([
          fetchOffersAction.pending.type,
          'data/fetchOffers/fulfilled'
        ]);
        expect(fetchOffersActionFulfilled.payload).toEqual(mockOffers);
      });
  });

  //Негативный сценарий. Сервер ответил 400
  it('should dispatch "fetchOffersAction.pending", "fetchOffersAction.rejected", when server response 400',
    async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400, []);

      await store.dispatch(fetchOffersAction());
      const actions = extractActionsTypes(store.getActions());


      expect(actions).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.rejected.type
      ]);
    });

  //Группа тестов для проверки loginACtion
  //  1)есть зависимость от LocalStorage 2)есть redirect 3)есть данные для post + есть token в ответе от сервера
  describe('loginAction', () => {
    it('should dispatch "loginAction.pending", fetchOffersAction.pending, fetchFavoritesAction.pending, "redirectToRoute", "loginAction.fulfilled" when server response 200',
      async () => {
        const fakeAuthData: AuthData = { email: 'test@test.com', password: 'qwe123' };
        const fakeServerReply = { token: 'secret' }; //часть данных которые пришлет сервер
        mockAxiosAdapter.onPost(APIRoute.Login).reply(200, fakeServerReply);

        await store.dispatch(loginAction(fakeAuthData));
        const actions = extractActionsTypes(store.getActions());

        expect(actions).toEqual([
          loginAction.pending.type,
          fetchOffersAction.pending.type,
          fetchFavoritesAction.pending.type,
          redirectToRoute.type,
          loginAction.fulfilled.type,
        ]);
      });

    it('should call "saveToken" once with the recieved token',
      async () => {
        const fakeAuthData: AuthData = { email: 'test@test.com', password: 'qwe123' };
        const fakeServerReply = { token: 'secret' };
        mockAxiosAdapter.onPost(APIRoute.Login).reply(200, fakeServerReply);

        //мокаем функцию saveToken с помощью инструментов vitest
        // spyOn() наблюдает за методом объекта и следит что она была вызвана
        // mockSaveToken будет вызываться в тесте вместо оригинала и собирать мету о вызове. она даст нам мета-инфу: была ли вызвана настоящая Фхб сколько раз, с какими аргументами и прочее.
        //  теперь всю мету-инфу можно получить в методах assertoionLib expect
        //1арг - объект, 2арг его метод. Поэтому мы так хитро импортировали tokenStorage
        const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

        await store.dispatch(loginAction(fakeAuthData));

        //тестим, что mockSaveToken() вызван один раз:
        expect(mockSaveToken).toBeCalledTimes(1);
        //тестим что mockSaveToken(token) был вызван с токеном от сервера
        expect(mockSaveToken).toBeCalledWith(fakeServerReply.token);
      });
  });

  describe('logoutAction', () => {
    it('should dispatch "logoutAction.pending", fetchOffersAction.pending, dropAllFavorites, "logoutAction.fulfilled" when server response 204',
      async () => {
        mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

        await store.dispatch(logoutAction());
        const actions = extractActionsTypes(store.getActions());

        expect(actions).toEqual([
          logoutAction.pending.type,
          fetchOffersAction.pending.type,
          dropAllFavorites.type,
          logoutAction.fulfilled.type,
        ]);
      });

    it('should call "dropToken" once with "logoutAction"',
      async () => {
        mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);
        const mockSaveToken = vi.spyOn(tokenStorage, 'dropToken');

        await store.dispatch(logoutAction());

        expect(mockSaveToken).toBeCalledTimes(1);
      });
  });

});
