import React from 'react';

const Main: React.FC = () => {
  return (
    <div>
      <button onClick={async () => {
        const x = await window.api.send('app:on-fs-dialog-open')
        console.log('lol', x)
      }}>XDXDXD</button>
      <h2>XDXD lol</h2>
    </div>
  );
};

export default Main;
