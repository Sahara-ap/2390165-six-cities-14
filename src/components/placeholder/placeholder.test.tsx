import { render, screen} from '@testing-library/react';
import { PlaceHolder } from './placeholder';

describe('Placeholder', () => {
  it('should render correctly', () => {
    const expectedText = /Loading/i;
    const expectedTextAltText = 'Preloader';

    render(<PlaceHolder />);
    const loadingText = screen.getByText(expectedText);
    const preloaderImg = screen.getByAltText(expectedTextAltText);

    expect(loadingText).toBeInTheDocument();
    expect(preloaderImg).toBeInTheDocument();
  });
});
