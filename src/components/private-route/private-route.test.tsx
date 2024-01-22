import { MemoryHistory, createMemoryHistory } from 'history';
import { AppRoute, AuthStatus } from '../../const';
import { withHistory, withStore } from '../../utilities/mock-component';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import { makeFakeState } from '../../utilities/mocks';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';

describe('Component: Private-Route', () => {
  let mockHistory: MemoryHistory;

  beforeAll(() => {
    mockHistory = createMemoryHistory();
  });

  beforeEach(() => {
    mockHistory.push(AppRoute.Favorite);
  });

  it('should render component for public route, when user not authorized', () => {
    //Идея - проверить работу динамического отображения в зависимости от условий
    //  Условие - определенный маршрут --> FavoritePage
    //  вместо FavPage и LoginPage будем использовать обычный react-element, чтобы не заморачиваться с зависимостями FavPage
    const expectedText = 'public route';
    const notExpectedText = 'private route';
    const mockState = makeFakeState();
    mockState.USER.authStatus = AuthStatus.NoAuth;


    //Вариант1: подготовим компонент к рендеру и вручную объединим history и Store:
    const mockStore = configureMockStore()(mockState);
    const preparedComponent1 = withHistory(
      <Provider store={mockStore} >
        <Routes>
          <Route path={AppRoute.Login} element={<span>{expectedText}</span>} />
          <Route path={AppRoute.Favorite} element={
            <PrivateRoute redirectTo={AppRoute.Login} >
              <span>{notExpectedText}</span>
            </PrivateRoute>
          }
          />
        </Routes>
      </Provider >,
      mockHistory
    );
    //Вариант2: подготовим компонент к рендеру через инструмент withStore
    const withHistoryComponent = withHistory(
      <Routes>
        <Route path={AppRoute.Login} element={<span>{expectedText}</span>} />
        <Route path={AppRoute.Favorite} element={
          <PrivateRoute redirectTo={AppRoute.Login} >
            <span>{notExpectedText}</span>
          </PrivateRoute>
        }
        />
      </Routes>,
      mockHistory
    );
    const { withStoreComponent: preparedComponent2 } = withStore(withHistoryComponent, mockState);

    // render(preparedComponent1);
    render(preparedComponent2);

    expect(screen.getByText(expectedText));
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
    //методы getBy.. всегда требуют, чтобы искомый текст был в документе иначе ошибка. Его поэтому нельзя использовать с методом .not
    //Чтобы убедиться что в документе НЕТ определенного текста --> использовать queryBy..
  });


  //обратный сценарий когда пользователь авторизован
  // mockStore должен быть исправлен поле USER.authStatus = AuthStatus.Auth
  it('should render component for private route when user authorized', () => {
    const expectedText = 'private route';
    const notExpectedText = 'public route';

    const mockState = makeFakeState();
    mockState.USER.authStatus = AuthStatus.Auth;
    const mockStoreCreator = configureMockStore();
    const mockStore = mockStoreCreator(mockState);

    const preparedComponent = withHistory(
      <Provider store={mockStore} >
        <Routes >
          <Route path={AppRoute.Login} element={<span>{notExpectedText}</span>} />
          <Route path={AppRoute.Favorite} element={
            <PrivateRoute redirectTo={AppRoute.Login}>
              <span>{expectedText}</span>
            </PrivateRoute>
          }
          />
        </Routes>
      </Provider>,
      mockHistory
    );

    render(preparedComponent);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText(notExpectedText)).not.toBeInTheDocument();
  });
});
