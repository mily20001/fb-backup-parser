import React, { useEffect, useState } from 'react';
import { JSONMessages } from './index';
import ConversationChart from './ConversationChart';
import styled from 'styled-components';
import { Progress, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import StartScreen from './StartScreen';
import ConversationList from './ConversationList';
import { setGlobal, useGlobal } from 'reactn';
import { set, keys, get } from 'idb-keyval';

const Main: React.FC = () => {
  const [conversations, setConversations] = useGlobal('conversations');
  const [owner, setOwner] = useGlobal('owner');
  const [progress, setProgress] = useState(-2);
  const [selectedID, setSelectedID] = useState<string[]>([]);
  const [cacheAvailable, setCacheAvailable] = useState<boolean>(false);
  useEffect(() => {
    console.log('useEffect');
    keys().then((keys) => setCacheAvailable(keys.includes('conversations')));
    window.api.receive('users', (u) => {
      console.log('received', new Date());
      // console.log(u);
      setConversations(
        (Object.values(u) as JSONMessages[]).sort((a, b) => b.messageCount - a.messageCount)
      );
      console.log('set', new Date());
      console.log(u);
      set(
        'conversations',
        (Object.values(u) as JSONMessages[]).sort((a, b) => b.messageCount - a.messageCount)
      );
    });
    window.api.receive('users-progress', (u) => {
      setProgress(u);
    });
    window.api.receive('owner', (u) => {
      setOwner(u);
      set('owner', u);
    });
  }, []);

  if (selectedID.length) {
    console.log('selectedID', selectedID);
    return (
      <CoreContainer>
        <MainContainer>
          <ConversationChart
            conversations={conversations.filter((c) => selectedID.includes(c.id))}
            back={() => setSelectedID([])}
          />
        </MainContainer>
      </CoreContainer>
    );
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

  return (
    <CoreContainer>
      <MainContainer>
        {conversations.length === 0 ? (
          progress === -2 ? (
            <StartScreen
              onFileChoose={() => window.api.send('app:on-fs-dialog-open')}
              cacheAvailable={cacheAvailable}
              loadFromCache={() => {
                get('owner').then((val) => val && setGlobal({ owner: val }));
                get('conversations').then((val) => val && setGlobal({ conversations: val }));
              }}
            />
          ) : progress === -1 ? (
            <div>
              <Spin indicator={antIcon} />
            </div>
          ) : (
            <div>
              <Progress type="circle" percent={Math.round(progress)} />
            </div>
          )
        ) : (
          <div>
            <h1>Hi {owner}!</h1>
            <div>
              <ConversationList
                conversations={conversations}
                openConversations={(ids) => setSelectedID(ids)}
              />
            </div>
          </div>
        )}
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
