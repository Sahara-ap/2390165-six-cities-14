// Тактика
//  1. Были ли произведены соответствующие actions
//  2. Были ли выполнены все dispatch
// Сетевое взаимодействие исключаем
//  Создать мок для axios
//  Замокать сам стор

import { configureMockStore } from '@jedmao/redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import axios from 'axios';

import { createAPI } from '../../services/apiService/api';
import { checkAuthAction, fetchOffersAction } from './api-actions';
import { APIRoute } from '../../const';
import { State } from '../../types/state';
import { makeFakeOffers } from '../../utilities/mocks';

type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>
const extractActionsTypes = (actions: Action<string>[]) => actions.map((action) => action.type);

describe('Async actions', () => {
  // Шаг1. мокаем axios с использованием библиотеки axios-mock-adapter
  //  позволяет подменить настоящие запросы к серверу
  // const axios = createAPI(); //создан экземпляр axios UPD! vitest в упор не хочет воспринимать функцию createAPI() и выдает ошибку на тест

  const api = axios.create({
    baseURL: 'https://14.design.pages.academy/six-cities',
    timeout: 5000,

  });
  const mockAxiosAdapter = new MockAdapter(api); //скормили экземпляр в адаптер, пропатчив его таким образом

  //Шаг2. мокаем стор
  //соберем все middleware в кучу:
  const middleware = [thunk.withExtraArgument(api)];
  //конфигурируем сам стор при помощи известного нам redux-mock-store от @jedmao
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  // перед каждым тестом необходимо обнулять стор, чтобы тесты не падали
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
        mockAxiosAdapter.onGet(APIRoute.Login).reply(200);

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

      console.log('Actions', store.getActions())
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


});
