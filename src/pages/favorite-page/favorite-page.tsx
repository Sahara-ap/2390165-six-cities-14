import { Helmet } from 'react-helmet-async';

import { useAppDispatch, useAppSelector } from '../../hooks';
import CardList from '../../components/card-list/card-list';

import { Favs, Offer } from '../../types/offer';
import FavoritesByCity from '../../types/favorites-by-city';
import { useEffect } from 'react';
import { fetchFavs, isFavsLoaded } from '../../store/actions';
import { PlaceHolder } from '../../components/placeholder/placeholder';

function FavoritePage(): JSX.Element {
  const dispatch = useAppDispatch();
  const isReady = useAppSelector((state) => state.isFavsLoaded);

  useEffect(() => {
    fetch('https://14.design.pages.academy/six-cities/favorite', {
      headers: {
        'x-token': 'b2xpdmVyLmNvbm5lckBnbWFpbC5jb20='
      }
    })
      .then((response) => response.json())
      .then((data: Favs[]) => dispatch(fetchFavs(data)))
      .then(() => setTimeout(() => {
        dispatch(isFavsLoaded());
      }, 500));
  }, []);

  const favoriteOffers: Favs[] = useAppSelector((state) => state.favs);

  function getFavoriteCities(favOffers: Array<Offer>): FavoritesByCity {


    const result = favOffers.reduce<FavoritesByCity>((acc, value) => {
      const city = value.city.name;
      if (!(city in acc)) {
        acc[city] = [];
      }
      acc[city].push(value);
      return acc;
    }, {});
    return result;
  }


  const favoritesByCity = getFavoriteCities(favoriteOffers);

  return (
    <>
      {!isReady && <PlaceHolder />}

      {
        isReady &&
        <div className="page">
          <Helmet>
            <title>{'6 cities - favorites'}</title>
          </Helmet>
          <main className="page__main page__main--favorites">
            <div className="page__favorites-container container">
              <section className="favorites">
                <h1 className="favorites__title">Saved listing</h1>
                <ul className="favorites__list">
                  {Object.entries(favoritesByCity).map(([city, favoriteList]) => (

                    < li key={city} className="favorites__locations-items">
                      <div className="favorites__locations locations locations--current">
                        <div className="locations__item">
                          <a className="locations__item-link" href="#">
                            <span>{city}</span>
                          </a>
                        </div>
                      </div>
                      <div className="favorites__places">
                        <CardList elementType='favorite' offers={favoriteList} />
                      </div>
                    </li>
                  ))}
                </ul>

              </section>
            </div>
          </main >
          <footer className="footer container">
            <a className="footer__logo-link" href="main.html">
              <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
            </a>
          </footer>
        </div >
      };
    </>
  );
}

export default FavoritePage;
