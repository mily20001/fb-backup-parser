import React from 'react';
import styled from 'styled-components';
import { Button, Space } from 'antd';

const StartScreen: React.FC<{
  onFileChoose: () => void;
  cacheAvailable: boolean;
  loadFromCache: () => void;
}> = ({ onFileChoose, cacheAvailable, loadFromCache }) => {
  return (
    <MainContainer>
      <Space direction="vertical" align="center">
      <Button size="large" onClick={() => onFileChoose()}>
        Choose file
      </Button>
      {cacheAvailable && (
        <Button size="large" onClick={() => loadFromCache()}>
          Load last session
        </Button>
      )}
      </Space>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;

export default StartScreen;
