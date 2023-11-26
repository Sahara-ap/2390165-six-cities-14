import Card from '../card/card';

import {NearOffer, Offer} from '../../types/offer';


type OfferListProps = {
  elementType: 'cities' | 'favorite' | 'offers';
  offers: Offer[] | NearOffer[];
  onCardHover?: (offerId: Offer['id'] | null) => void;
}

function CardList({ elementType, offers, onCardHover }: OfferListProps) {
  return (
    <>
      {
        offers.map((offer) => (
          <Card
            key={offer.id}
            elementType={elementType}
            offer={offer}
            onCardHover = {onCardHover}
          />
        ))
      }
    </>
  );
}

export default CardList;
