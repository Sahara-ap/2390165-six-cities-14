import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ReviewList from './review-ist/review-list';
import ReviewForm from './review-form/review-form';
import { postFavStatusAction } from '../../store/api-actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute, AuthStatus } from '../../const';

import { SelectedOffer } from '../../types/offer';
import { getAuthStatus } from '../../store/users-process/user-process-selectors';
import { getRatingValue } from '../../utilities/utilities';

type OfferDetailsProps = {
  selectedOffer: SelectedOffer;
}

function OfferDetails({ selectedOffer }: OfferDetailsProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isFavorite, setIsFavorite] = useState(selectedOffer.isFavorite);

  const authStatus = useAppSelector(getAuthStatus);

  const isAvailableForm = authStatus === AuthStatus.Auth;

  function handleFavClick() {
    if (authStatus === AuthStatus.NoAuth) {
      navigate(AppRoute.Login);
      return;
    }

    const status = isFavorite ? 0 : 1;
    if (authStatus === AuthStatus.Auth) {
      dispatch(postFavStatusAction({ offerId: selectedOffer.id, status: status })).unwrap()
        .then((response) => {
          setIsFavorite(response.isFavorite);
        });
    }
  }

  return (
    <>
      <div className="offer__gallery-container container">
        <div className="offer__gallery">
          {
            selectedOffer.images?.slice(0, 6).map((img) => (
              <Fragment key={img}>
                <div className="offer__image-wrapper">
                  <img className="offer__image" src={img} alt="Photo studio" />
                </div>
              </Fragment>
            ))
          }
        </div>
      </div>
      <div className="offer__container container">
        <div className="offer__wrapper">
          {
            selectedOffer.isPremium &&
            <div className="offer__mark">
              <span>Premium</span>
            </div>
          }

          <div className="offer__name-wrapper">
            <h1 className="offer__name">
              {selectedOffer.title}
            </h1>
            <button
              className={`${(isFavorite && authStatus === AuthStatus.Auth) ? 'offer__bookmark-button--active ' : ''}offer__bookmark-button button`}
              type="button"
              onClick={handleFavClick}
            >
              <svg className="offer__bookmark-icon" width="31" height="33">
                <use xlinkHref="#icon-bookmark"></use>
              </svg>
              <span className="visually-hidden">To bookmarks</span>
            </button>
          </div>
          <div className="offer__rating rating">
            <div className="offer__stars rating__stars">
              <span style={{ width: `${getRatingValue(selectedOffer.rating)}%` }}></span>
              <span className="visually-hidden">Rating</span>
            </div>
            <span className="offer__rating-value rating__value">{selectedOffer.rating}</span>
          </div>
          <ul className="offer__features">
            <li className="offer__feature offer__feature--entire">
              {selectedOffer.type[0].toUpperCase() + selectedOffer.type.slice(1)}
            </li>
            <li className="offer__feature offer__feature--bedrooms">
              {selectedOffer.bedrooms} {selectedOffer.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
            </li>
            <li className="offer__feature offer__feature--adults">
              Max {selectedOffer.maxAdults} {selectedOffer.maxAdults === 1 ? 'adult' : 'adults'}
            </li>
          </ul>
          <div className="offer__price">
            <b className="offer__price-value">&euro;{selectedOffer.price}</b>
            <span className="offer__price-text">&nbsp;night</span>
          </div>
          <div className="offer__inside">
            <h2 className="offer__inside-title">What&apos;s inside</h2>
            <ul className="offer__inside-list">
              {
                selectedOffer.goods.map((good) => (
                  <Fragment key={good}>
                    <li className="offer__inside-item">
                      {good}
                    </li>
                  </Fragment>

                ))
              }

            </ul>
          </div>
          <div className="offer__host">
            <h2 className="offer__host-title">Meet the host</h2>
            <div className="offer__host-user user">
              <div className={`${selectedOffer.host.isPro ? 'offer__avatar-wrapper--pro ' : ''}offer__avatar-wrapper user__avatar-wrapper`}>
                <img className="offer__avatar user__avatar" src={selectedOffer.host.avatarUrl} width="74" height="74" alt="Host avatar" />
              </div>
              <span className="offer__user-name">
                {selectedOffer.host.name}
              </span>
              {
                selectedOffer.host.isPro &&
                <span className="offer__user-status">
                  Pro
                </span>
              }
            </div>
            <div className="offer__description">
              <p className="offer__text">
                {selectedOffer.description}
              </p>
            </div>
          </div>
          <section className="offer__reviews reviews">
            <ReviewList />
            {
              isAvailableForm && <ReviewForm />
            }

          </section>
        </div>
      </div >
    </>
  );
}

export default OfferDetails;
