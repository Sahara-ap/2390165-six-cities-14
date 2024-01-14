import Review from '../review/review';

import { useAppSelector } from '../../../hooks';
import { getReviews } from '../../../store/offer-data/offer-data-selectors';
import { convertDateInMs } from '../../../utilities/utilities';

const MAX_COMMENT_LENGTH = 10;

function ReviewList(): JSX.Element {

  const reviewServer = useAppSelector(getReviews);

  const reviewServerCopy = structuredClone(reviewServer)
    .sort((a, b) => convertDateInMs(b.date) - convertDateInMs(a.date))
    .slice(0, MAX_COMMENT_LENGTH);


  return (
    <>
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviewServer.length}</span></h2>
      <ul className="reviews__list">
        {reviewServerCopy.map((review) => (
          <Review
            key={review.id}
            review={review}
          />
        ))}
      </ul>
    </>
  );
}

export default ReviewList;
