import { Helmet } from 'react-helmet-async';
import { Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { AppRoute } from '../../const';
import Map from '../../components/map/map';
import OfferDetails from '../../components/offer-details/offer-details';
import NearPlaces from '../../components/near-places/near-places';
import { fetchNearPlaces, fetchSelectedOffer, isSelectedOfferLoaded } from '../../store/actions';
import { useAppDispatch, useAppSelector } from '../../hooks';


import { FullOffer, NearOffer, SelectedOffer } from '../../types/offer';
import { PlaceHolder } from '../../components/placeholder/placeholder';


function OfferPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { offerId } = useParams();
  const nearOffers: NearOffer[] = useAppSelector((state) => state.nearPlaces);
  const selectedOffer = useAppSelector((state) => state.selectedOffer);
  const isReady = useAppSelector((state) => state.isSelectedOfferLoaded);

  useEffect(() => {
    if (offerId) {
      fetch(`https://14.design.pages.academy/six-cities/offers/${offerId}`)
        .then((response) => response.json())
        .then((data: SelectedOffer) => dispatch(fetchSelectedOffer(data)))
        .then(() => setTimeout(() => {
          dispatch(isSelectedOfferLoaded());
        }, 500));
    }
  }, []);


  useEffect(() => {
    fetch(`https://14.design.pages.academy/six-cities/offers/${offerId}/nearby`)
      .then((response) => response.json())
      .then((data: NearOffer[]) => dispatch(fetchNearPlaces(data)));
  }, [offerId]);

  if (!selectedOffer && !offerId) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  const nearOffersCut = nearOffers.slice(0, 3);
  const onMapOffers: FullOffer[] | null = [...nearOffersCut, selectedOffer];


  return (
    <>
      {!isReady && <PlaceHolder />}

      {isReady && selectedOffer && onMapOffers &&
        <div className="page">
          <Helmet>
            <title>{'6 cities - offer'}</title>
          </Helmet>
          <main className="page__main page__main--offer">
            <section className="offer">
              <OfferDetails selectedOffer={selectedOffer} />
              <Map
                mapType={'offer'}
                offers={onMapOffers}
              />
            </section>
            <div className="container">
              <NearPlaces upcomingOffers={nearOffersCut} />
            </div>
          </main>
        </div>};
    </>
  );
}

export default OfferPage;
