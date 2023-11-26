import CardList from '../card-list/card-list';

import {NearOffer} from '../../types/offer';

type NearPlacesProps = {
  upcomingOffers: NearOffer[];
}

function NearPlaces({upcomingOffers}: NearPlacesProps): JSX.Element {

  return (
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <div className="near-places__list places__list">
        <CardList elementType="offers" offers={upcomingOffers} />
      </div>
    </section>
  );
}

export default NearPlaces;
