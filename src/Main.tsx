import React, { useEffect, useState } from 'react';
import { JSONMessages } from './index';
import ConversationChart from './ConversationChart';
import styled from 'styled-components';
import { Button } from 'antd';
import StartScreen from './StartScreen';
import ConversationList from './ConversationList';

const Main: React.FC = () => {
  const [basicInfo, setBasicInfo] = useState<JSONMessages[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedID, setSelectedID] = useState<string[]>([]);
  useEffect(() => {
    console.log('useEffect');
    window.api.receive('users', (u) => {
      console.log('received', new Date());
      // console.log(u);
      setBasicInfo(
        (Object.values(u) as JSONMessages[]).sort((a, b) => b.messageCount - a.messageCount)
      );
      console.log('set', new Date());
      console.log(u);
    });
    window.api.receive('users-progress', (u) => {
      setProgress(u * 100);
    });
  }, []);

  if (selectedID.length) {
    console.log('selectedID', selectedID)
    return (
      <CoreContainer>
        <MainContainer>
          <ConversationChart
            conversations={basicInfo.filter((c) => selectedID.includes(c.id))}
            back={() => setSelectedID([])}
          />
        </MainContainer>
      </CoreContainer>
    );
  }

  return (
    <CoreContainer>
      <MainContainer>
        {basicInfo.length === 0 ? (
          <StartScreen onFileChoose={() => window.api.send('app:on-fs-dialog-open')} />
        ) : (
          <ConversationList
            conversations={basicInfo}
            openConversations={(ids) => setSelectedID(ids)}
          />
        )}
        {/*<Button onClick={() => window.api.send('app:on-fs-dialog-open')}>XDXDXD</Button>*/}
        {/*<h1>Progress: {progress}%</h1>*/}
        {/*<div>*/}
        {/*  {basicInfo.map((entry) => (*/}
        {/*    <div key={entry.id} onClick={() => setSelectedID(entry.id)}>*/}
        {/*      {entry.title} {entry.messageCount}*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </MainContainer>
    </CoreContainer>
  );
};

const CoreContainer = styled.div`
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  //background-color: red;
  position: relative;
  display: flex;
`;

const MainContainer = styled.div`
  flex-grow: 1;
  //background-color: green;
  padding: 10px;
  display: flex;
`;

export default Main;
