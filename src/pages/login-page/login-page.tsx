import { FormEvent, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginAction } from '../../store/api-action/api-actions';
import { getAuthStatus } from '../../store/users-process/user-process-selectors';
import { setCity } from '../../store/app-process/app-process-slice';

import { AppRoute, AuthStatus, CITY_NAMES } from '../../const';
import { pickRandomElement } from '../../utilities/utilities';
import Header from '../../components/header/header';


function LoginPage() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const authStatus = useAppSelector(getAuthStatus);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const randomCity = pickRandomElement(CITY_NAMES);

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (emailRef.current && passwordRef.current) {
      dispatch(loginAction({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }));
      dispatch(setCity({ city: randomCity }));
    }
  }

  if (authStatus === AuthStatus.Auth) {
    return <Navigate to={AppRoute.Main} />;
  }


  function handleRandomCityClick(event: React.MouseEvent) {
    event.preventDefault();

    dispatch(setCity({ city: randomCity }));
    navigate(AppRoute.Main);
  }

  return (
    <div className="page page--gray page--login">
      <Helmet>
        <title>{'6 cities - login'}</title>
      </Helmet>
      <Header block={'noNavigation'}/>
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleFormSubmit}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  ref={emailRef}
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  data-testid="loginElement"
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  ref={passwordRef}
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  pattern="([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)"
                  required
                  data-testid="passwordElement"
                />
              </div>
              <button
                className="login__submit form__submit button"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <Link
                className="locations__item-link"
                to={'/'}
                onClick={handleRandomCityClick}
              >
                <span>{randomCity}</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
