import { useEffect } from 'react';

import Cities from '../../components/cities/cities';
import Filter from '../../components/filter/filter';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { PlaceHolder } from '../../components/placeholder/placeholder';
import { useGetOffers } from '../../services/apiService/api';

function MainPage(): JSX.Element {
  const offers = useAppSelector((state) => state.offers);
  const isLoaded = useAppSelector((state) => state.isLoaded);
  const dispatch = useAppDispatch();

  useGetOffers(dispatch, 'offers');
  // useEffect(() => {

  //   fetch('https://14.design.pages.academy/six-cities/offers')
  //     .then((response) => response.json())
  //     .then((data) => dispatch(setOffers(data)))
  //     .then(() => setTimeout(() =>
  //       dispatch(isReady()), 500));
  // }, []);


  const filterValue = useAppSelector((state) => state.activeCity);
  const offersByCity = offers.filter((offer) => offer.city.name === filterValue);

  return (
    <>
      {!isLoaded && <PlaceHolder />}

      {isLoaded &&
        <div className="page page--gray page--main">
          <main className="page__main page__main--index">
            <h1 className="visually-hidden">Cities</h1>
            <div className="tabs">
              <section className="locations container">
                <Filter />
              </section>
            </div>
            <Cities offersByCity={offersByCity} selectedCity={filterValue} />
          </main>
        </div>};

    </>

  );
}

export default MainPage;
