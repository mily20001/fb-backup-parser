import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import ConversationViewRoute from './ConversationViewRoute';
import { setGlobal } from 'reactn';

declare global {
  interface Window {
    api: {
      send: (channel: string, data?: string) => void;
      receive: (channel: string, cb: (data: any) => void) => void;
    };
  }
}

setGlobal({ conversations: [] });

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/" exact>
            <Main />
          </Route>
          <Route path="/conversation/:id">
            <ConversationViewRoute />
          </Route>
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
