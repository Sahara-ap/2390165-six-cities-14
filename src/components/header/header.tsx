import { Link, useLocation } from 'react-router-dom';

import { AppRoute, AuthStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutAction } from '../../store/api-action/api-actions';
import { getAuthStatus, getUserData } from '../../store/users-process/user-process-selectors';
import { getFavs } from '../../store/offer-data/offer-data-selectors';

type HeaderProps = {
  block?: 'hasNavigation' | 'noNavigation';
}

function Header({block}: HeaderProps): JSX.Element {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const favs = useAppSelector(getFavs);
  const userData = useAppSelector(getUserData);
  const authStatus = useAppSelector(getAuthStatus);

  const isMain = pathname === AppRoute.Main as string;

  const link = isMain ? '' : AppRoute.Main;

  function handleSignOutClick(event: React.MouseEvent) {
    event.preventDefault();

    dispatch(logoutAction());
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className={`header__logo-link ${isMain ? 'header__logo-link--active' : ''}`}
              to={link}
            >
              <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
            </Link>
          </div>
          {
            block === 'hasNavigation' && authStatus === AuthStatus.Auth &&
            <nav className="header__nav">
              <ul className="header__nav-list">
                {
                  userData &&
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to={userData ? AppRoute.Favorite : AppRoute.Login}>
                        <div style={{ backgroundImage: `url(${userData.avatarUrl})`, borderRadius: '50%' }} className="header__avatar-wrapper user__avatar-wrapper">
                        </div>
                        <span className="header__user-name user__name header__login">{userData ? userData.email : 'Sign in'}</span>
                        <span className="header__favorite-count">{favs.length}</span>
                      </Link>
                    </li>

                    <li className="header__nav-item">
                      <Link
                        className="header__nav-link"
                        to="/"
                        onClick={handleSignOutClick}
                      >
                        <span
                          className="header__signout"
                        >
                          Sign out
                        </span>
                      </Link>
                    </li>
                  </>
                }

              </ul>
            </nav>
          }
          {
            block === 'hasNavigation' && authStatus === AuthStatus.NoAuth &&
            <nav className='header__nav'>
              <ul className='header__nav-list'>
                <li className='header__nav-item user'>
                  <Link to={AppRoute.Login} className='header__nav-link header__nav-link--profile'>
                    <div className='header__avatar-wrapper user__avatar-wrapper'></div>
                    <span className='header__login'>Sign in</span>
                  </Link>
                </li>
              </ul>
            </nav>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;
