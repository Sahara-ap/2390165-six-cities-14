import Card from '../card/card';

import { Offer } from '../../types/offer';
import { memo } from 'react';

type OfferListProps = {
  elementType: 'cities' | 'favorite' | 'offers';
  offers: Offer[];
  onCardHover?: (offerId: Offer['id'] | null) => void;
}

function CardListComponent({ elementType, offers, onCardHover }: OfferListProps) {

  return (
    <>
      {
        offers.map((offer) => (
          <Card
            key={offer.id}
            elementType={elementType}
            offer={offer}
            onCardHover={onCardHover}
          />
        ))
      }
    </>
  );
}

const CardList = memo(CardListComponent);

export default CardList;
