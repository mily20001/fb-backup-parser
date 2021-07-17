import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main';

declare global {
  interface Window {
    api: {
      send: (channel: string) => void;
    };
  }
}

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
