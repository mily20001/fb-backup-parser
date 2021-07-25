import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main';
import 'antd/dist/antd.css';

declare global {
  interface Window {
    api: {
      send: (channel: string, data?: string) => void;
      receive: (channel: string, cb: (data: any) => void) => void;
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
