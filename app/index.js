import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';

const onLoad = () => {
  const splash = document.getElementById('splash');
};

const render = async (Component) => {
  const target = document.getElementById('root');
  try {
    const { AppContainer } = await import('react-hot-loader');
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      target,
      onLoad,
    );
  } catch (e) {
    ReactDOM.render(<Component />, target, onLoad);
  }
}

import('app/components/App')
  .then(({ default: App }) => render(App));

if (module.hot) {
  module.hot.accept('app/components/App', async () => {
    const { default: NextApp } = await import('app/components/App');
    render(NextApp);
  });
}