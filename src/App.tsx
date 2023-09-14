import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './Main';
import 'antd/dist/reset.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const root = createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      {/* TODO HashRouter is not the greatest */}
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/conversation/:id" element={<ConversationViewRoute />}/>
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </React.StrictMode>,
    
  );
}

render();
