import Cities from '../../components/cities/cities';
import Filter from '../../components/filter/filter';

import { useAppSelector } from '../../hooks';
import { PlaceHolder } from '../../components/placeholder/placeholder';
import { AuthStatus } from '../../const';
import MainEmpty from '../../components/main-empty/main-empty';
import { getIsLoaded, getOffers } from '../../store/offer-data/offer-data-selectors';
import { getAuthStatus } from '../../store/users-process/user-process-selectors';
import { getActiveCity } from '../../store/app-process/app-process-selectors';

function MainPage(): JSX.Element {
  const offers = useAppSelector(getOffers);
  const isLoaded = useAppSelector(getIsLoaded);
  const authStatus = useAppSelector(getAuthStatus);

  const filterValue = useAppSelector(getActiveCity);
  const offersByCity = offers.filter((offer) => offer.city.name === filterValue);

  const offersLength = offersByCity.length;

  return (
    <>
      {(!isLoaded || authStatus === AuthStatus.Unknown) && <PlaceHolder />}

      {isLoaded && offersByCity &&
        <div className="page page--gray page--main">
          <main className="page__main page__main--index">
            <h1 className="visually-hidden">Cities</h1>
            <div className="tabs">
              <section className="locations container">
                <Filter />
              </section>
            </div>
            {!offersLength && <MainEmpty />}
            <Cities offersByCity={offersByCity} selectedCity={filterValue} />
          </main>
        </div>}

    </>

  );
}

export default MainPage;
