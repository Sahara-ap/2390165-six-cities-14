import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withHistory, withStore } from '../../utilities/mock-component';
import LoginPage from './login-page';
import { makeFakeState } from '../../utilities/mocks';

describe('Component: LoginPage', () => {
  it('should render correctly', () => {
    const loginText = 'E-mail';
    const passwordText = 'Password';

    const mockStore = makeFakeState();
    const { withStoreComponent } = withStore(<LoginPage />, mockStore); //получили обертку компонента в ReduxProvider
    const preparedComponent = withHistory(withStoreComponent); //порядок строк 11 и 12 неважен

    render(preparedComponent);

    expect(screen.getByText(loginText)).toBeInTheDocument();
    expect(screen.getByText(passwordText)).toBeInTheDocument();
  });

  it('should render correctly when user enter login and password',
    async () => {
      // const loginElement = screen.getByTestId('loginElement'); Нельзя так потому что пользователь еще не ввел текст
      const loginTestId = 'loginElement';
      const passwordTestId = 'passwordElement';
      const expectedLoginValue = 's@gmail.com';
      const expectedPasswordValue = 'qwer123';

      const mockStore = makeFakeState();
      const { withStoreComponent } = withStore(<LoginPage />, mockStore);
      const preparedComponent = withHistory(withStoreComponent);

      render(preparedComponent);

      //имитируем действия пользователя и события с пом библиотеки user-event
      // await userEvent.type( //метод type() имитирует ввод текста пользователем
      //   loginElement, //куда вводим
      //   expectedLoginValue //что вводим
      // );
      await userEvent.type(
        screen.getByTestId(loginTestId), //screen дб именно здесь, тк действие ассинхронно. Нельзя вынести, т.к. user еще не ввел текст
        expectedLoginValue
      );
      await userEvent.type(
        screen.getByTestId(passwordTestId),
        expectedPasswordValue
      );

      expect(screen.getByDisplayValue(expectedLoginValue)).toBeInTheDocument(); //getByDisplayValue - получает введенные на экране значения
      expect(screen.getByDisplayValue(expectedPasswordValue)).toBeInTheDocument();
    });

});
