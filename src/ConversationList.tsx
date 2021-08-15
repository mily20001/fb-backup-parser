import React, { useState } from 'react';
import styled from 'styled-components';
import { JSONMessages } from './index';
import { ColumnsType } from 'antd/es/table';
import { Button, Table } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import * as H from 'history';

interface ConversationTable {
  key: string;
  title: string;
  firstMessage: number;
  lastMessage: number;
  messageCount: number;
}

const getColumns: (history: H.History) => ColumnsType<ConversationTable> = (history) => [
  {
    key: 'title',
    dataIndex: 'title',
    title: 'Title',
    sorter: (a, b) => (a.title > b.title ? 1 : a.title < b.title ? -1 : 0),
  },
  {
    key: 'messageCount',
    dataIndex: 'messageCount',
    title: 'Message count',
    sorter: (a, b) => a.messageCount - b.messageCount,
  },
  {
    key: 'firstMessage',
    dataIndex: 'firstMessage',
    title: 'First message',
    render: (value) => new Date(value).toLocaleDateString(),
    sorter: (a, b) => a.firstMessage - b.firstMessage,
  },
  {
    key: 'lastMessage',
    dataIndex: 'lastMessage',
    title: 'Last message',
    render: (value) => new Date(value).toLocaleDateString(),
    sorter: (a, b) => a.lastMessage - b.lastMessage,
  },
  {
    key: 'action',
    title: 'Action',
    render: (_, row) => (
      <Button
        icon={<LineChartOutlined />}
        onClick={() => history.push(`/conversation/${row.key}`)}
      />
    ),
    sorter: (a, b) => a.lastMessage - b.lastMessage,
  },
];

const ConversationList: React.FC<{
  conversations: JSONMessages[];
  openConversations: (ids: string[]) => void;
}> = ({ conversations, openConversations }) => {
  const data: ConversationTable[] = conversations.map((conversation) => ({
    key: conversation.id,
    messageCount: conversation.messageCount,
    firstMessage: conversation.first_msg_timestamp,
    lastMessage: conversation.last_msg_timestamp,
    title: conversation.title,
  }));

  const history = useHistory();
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <MainContainer>
      <Table
        columns={getColumns(history)}
        dataSource={data}
        rowSelection={{
          type: 'checkbox',
          onChange: (keys) => {
            setSelected(keys as string[]);
          },
        }}
      />
      <Button
        type="primary"
        size="large"
        disabled={!selected.length}
        onClick={() => openConversations(selected)}
      >
        Show chart ({selected.length})
      </Button>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default ConversationList;
