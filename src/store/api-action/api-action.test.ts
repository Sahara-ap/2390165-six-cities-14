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
import { checkAuthAction } from './api-actions';
import { APIRoute } from '../../const';
import { State } from '../../types/state';

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
});
