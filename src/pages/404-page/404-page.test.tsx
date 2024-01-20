import { render, screen } from '@testing-library/react';
// import { withHistory } from '../../utilities/mock-component';
import NotFound from './404-page';
import { HelmetProvider } from 'react-helmet-async';
import HistoryRouter from '../../components/history-route/history-route';
import { createMemoryHistory } from 'history';

describe('Component: 404-page', () => {
  const memoryHistory = createMemoryHistory();
  it('should render correctly', () => {
    const expectedHeaderText = '404 NOT FOUND';
    const expectedLinkText = 'Go to main page';

    // render(withHistory(<NotFound />));
    render(
      <HistoryRouter history={memoryHistory}>
        <HelmetProvider>
          <NotFound />
        </HelmetProvider>

      </HistoryRouter>
    );

    expect(screen.getByText(expectedHeaderText)).toBeInTheDocument();
    expect(screen.getByText(expectedLinkText)).toBeInTheDocument();

  });
});
