import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';

const StartScreen: React.FC<{ onFileChoose: () => void }> = ({ onFileChoose }) => {
  return (
    <MainContainer>
      <Button size="large" onClick={() => onFileChoose()}>
        Choose file
      </Button>
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
