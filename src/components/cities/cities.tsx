import { useCallback, useState } from 'react';

import CardList from '../card-list/card-list';
import Map from '../map/map';

import Sort from '../sort/sort';

import { ActiveCity } from '../../types/city';
import { Offer } from '../../types/offer';
import { SortType } from '../../types/sort';

type CitiesProps = {
  offersByCity: Array<Offer>;
  selectedCity: ActiveCity;
}

function Cities({ offersByCity, selectedCity }: CitiesProps): JSX.Element {

  const [hoveredOfferId, setHoveredOfferId] = useState<Offer['id'] | null>(null);
  const [sortItem, setSortItem] = useState<SortType>('Popular');

  const sortCallbacks: Record<SortType, (a: Offer, b: Offer) => number> = {
    'Popular': () => 0,
    'Price: low to high': (a, b) => a.price - b.price,
    'Price: high to low': (a, b) => b.price - a.price,
    'Top rated first': (a, b) => b.rating - a.rating,
  };
  const defaultSort = sortCallbacks['Popular'];
  const sort = sortCallbacks[sortItem] ?? defaultSort;
  // перед сортировкой копирую массив. В данном конкретном случае это нужно для отмены мемоизации при выборе сортировки
  const sortedOffers = offersByCity.slice().sort(sort);
  // const sortedOffers = offersByCity.sort(sort);

  // function handleCardHover(offerId: Offer['id'] | null) {
  //   setHoveredOfferId(offerId);
  // }


  //--> мемоизирую коллбэк. В зависимостях указываются переменные, изменение которых, отменит мемоизацию, т.е. создаст новый коллбек при перерисовке Cities
  //--> CardList все-равно перерисовывается при наведении на карточку по одной причине:
  //     1)offerId живет в state компонента, который перерисовывается и создает по новой все переменные внутри своего тела
  //        sortedOffers при создании использует копию пропса (slice().sort(), следовательно при перерисовке это будет новый массив
  //        Новый массив передается пропсом offers={sortedOffers} в CardList --> перерисовка
  //         Убрать slice() мы не можем, иначе при смене значения сортировки нам нужна перерисовка CardList, но мемоизированный CardList не даст нам ее

  const handleCardHover = useCallback(
    (offerId: Offer['id'] | null) => setHoveredOfferId(offerId)
    , []);

  return (
    <div className="cities">
      <div className="cities__places-container container">
        <section className="cities__places places">
          <h2 className="visually-hidden">Places</h2>
          <b className="places__found">{offersByCity.length} {offersByCity.length === 1 ? 'place' : 'places'} to stay in {selectedCity}</b>
          <Sort cb={setSortItem} />
          <div className="cities__places-list places__list tabs__content">
            <CardList
              elementType={'cities'}
              offers={sortedOffers}
              onCardHover={handleCardHover}
            />
          </div>
        </section>
        <div className="cities__right-section">
          <Map
            mapType={'cities'}
            offers={offersByCity}
            offerId={hoveredOfferId}
          />
        </div>
      </div>
    </div>

  );
}

export default Cities;
