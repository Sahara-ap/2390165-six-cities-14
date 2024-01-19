import { Link, useNavigate } from 'react-router-dom';
import { Offer } from '../../types/offer';
import { AppRoute, AuthStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { postFavStatusAction } from '../../store/api-action/api-actions';
import { getAuthStatus } from '../../store/users-process/user-process-selectors';
import { memo } from 'react';
import { getRatingValue } from '../../utilities/utilities';


type CardProps = {
  elementType: 'cities' | 'favorite' | 'offers';
  offer: Offer;
  onCardHover?: (offerId: Offer['id'] | null) => void;
}

const options = {
  cities: {
    className: 'cities',
    width: '260',
    height: '200',
  },
  favorite: {
    className: 'favorites',
    width: '150',
    height: '110',
  },
  offers: {
    className: 'near-places',
    width: '260',
    height: '200',
  },
};

function CardComponent({ elementType, offer, onCardHover }: CardProps): JSX.Element {

  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(getAuthStatus);
  const navigate = useNavigate();

  function handleFavClick(favOffer: Offer) {
    if (authStatus === AuthStatus.NoAuth) {
      navigate(AppRoute.Login);
      return;
    }

    const isFavorite = favOffer.isFavorite;
    const status = isFavorite ? 0 : 1;
    if (authStatus === AuthStatus.Auth) {
      dispatch(postFavStatusAction({ offerId: offer.id, status: status, elementType: elementType }));

    }

  }

  function handleMouseEnter() {
    onCardHover?.(offer.id);
  }

  function handleMouseLeave() {
    onCardHover?.(null);
  }

  return (

    <article
      className={`${options[elementType].className}__card place-card`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {
        offer.isPremium &&
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      }

      <div className={`${options[elementType].className}__image-wrapper place-card__image-wrapper`}>
        <Link to={`${AppRoute.Offer}${offer.id}`}>
          <img className="place-card__image" src={offer.previewImage} width={options[elementType].width} height={options[elementType].height} alt="Place image" />
        </Link>
      </div>
      <div className={`${elementType === 'favorite' ? 'favorites__card-info ' : ''}'place-card__info'`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`${(offer.isFavorite && authStatus === AuthStatus.Auth) ? 'place-card__bookmark-button--active ' : ''}place-card__bookmark-button button`}
            type="button"
            onClick={() => handleFavClick(offer)}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">To bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{ width: `${getRatingValue(offer.rating)}%` }}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}${offer.id}`}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.type}</p>
      </div>
    </article>

  );
}

const Card = memo(CardComponent);

export default Card;
