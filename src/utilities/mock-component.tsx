import { MemoryHistory, createMemoryHistory } from 'history';
import HistoryRouter from '../components/history-route/history-route';
import { HelmetProvider } from 'react-helmet-async';

function withHistory(component: JSX.Element, history?: MemoryHistory) {
  // если history не передаем, то создаем его прямо здесь внутри HOC
  // будут кейсы, когда нам понадобится передать свой кастомный хистори
  const memoryHistory = history ?? createMemoryHistory();

  return (
    <HistoryRouter history={memoryHistory}>
      <HelmetProvider>
        {component}
      </HelmetProvider>

    </HistoryRouter>
  );
}

export {
  withHistory,
};
