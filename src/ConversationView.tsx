import React from 'react';
import { useGlobal } from 'reactn';
import styled from 'styled-components';
import { Button, Statistic, Card, Row, Col, Table } from 'antd';
import {
  LeftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import { Message } from './index';

interface ConversationStats {
  avgMsgLengthInChars: number;
  avgSentMsgLengthInChars: number;
  avgReceivedMsgLengthInChars: number;
  avgMsgLengthInWords: number;
  avgSentMsgLengthInWords: number;
  avgReceivedMsgLengthInWords: number;
  totalWords: number;
  totalWordsSent: number;
  totalWordsReceived: number;
  totalChars: number;
  totalCharsSent: number;
  totalCharsReceived: number;
  totalMsg: number;
  sentMsg: number;
  receivedMsg: number;
  totalPictures: number;
  sentPictures: number;
  receivedPictures: number;
  totalVideos: number;
  sentVideos: number;
  receivedVideos: number;
  totalGIFs: number;
  sentGIFs: number;
  receivedGIFs: number;
  totalStickers: number;
  sentStickers: number;
  receivedStickers: number;
  mostPopularWords: MostPopularWordsTable[];
}

const WORD_DELIM_REGEX = /\s+/;

const countChars = (messages: Message[]): number =>
  messages.filter((m) => m.content).reduce((sum, m) => sum + m.content.length, 0);
const countWords = (messages: Message[]): number =>
  messages
    .filter((m) => m.content)
    .reduce((sum, m) => {
      const match = m.content.trim().match(WORD_DELIM_REGEX);
      return sum + (match ? match.length : 0) + 1;
    }, 0);

const countPictures = (messages: Message[]): number =>
  messages.reduce((sum, m) => sum + (m.photos ? m.photos.length : 0), 0);
const countVideos = (messages: Message[]): number =>
  messages.reduce((sum, m) => sum + (m.videos ? m.videos.length : 0), 0);
const countGIFs = (messages: Message[]): number =>
  messages.reduce((sum, m) => sum + (m.gifs ? m.gifs.length : 0), 0);
const countStickers = (messages: Message[]): number => messages.filter((m) => m.sticker).length;

const getConversationStats = (messages: Message[], owner: string): ConversationStats => {
  const sentMessages = messages.filter((m) => m.sender_name === owner);
  const receivedMessages = messages.filter((m) => m.sender_name !== owner);
  const words = messages
    .filter((m) => m.content)
    .reduce((all, m) => {
      m.content
        .trim()
        .split(WORD_DELIM_REGEX)
        .forEach((w) => {
          const s_w = w.toLowerCase().replace(/[?!,.]+/g, '');
          if (!all[s_w]) {
            all[s_w] = 0;
          }

          all[s_w] += 1;
        });
      return all;
    }, {} as { [key in string]: number });

  const mostPopularWords = Object.keys(words)
    .filter((key) => words[key] > 10)
    .sort((a, b) => words[b] - words[a])
    .map((key) => ({ word: key, count: words[key] }));

  const totalChars = countChars(messages);
  const totalCharsSent = countChars(sentMessages);
  const totalCharsReceived = countChars(receivedMessages);
  const totalWords = countWords(messages);
  const totalWordsSent = countWords(sentMessages);
  const totalWordsReceived = countWords(receivedMessages);
  const totalDivider = messages.filter((m) => m.content).length || 1;
  const sentDivider = sentMessages.filter((m) => m.content).length || 1;
  const receivedDivider = receivedMessages.filter((m) => m.content).length || 1;

  return {
    avgMsgLengthInChars: totalChars / totalDivider,
    avgSentMsgLengthInChars: totalCharsSent / sentDivider,
    avgReceivedMsgLengthInChars: totalCharsReceived / receivedDivider,
    avgMsgLengthInWords: totalWords / totalDivider,
    avgSentMsgLengthInWords: totalWordsSent / sentDivider,
    avgReceivedMsgLengthInWords: totalWordsReceived / receivedDivider,
    totalChars,
    totalCharsReceived,
    totalCharsSent,
    totalWords,
    totalWordsReceived,
    totalWordsSent,
    totalMsg: messages.length,
    sentMsg: sentMessages.length,
    receivedMsg: receivedMessages.length,
    totalPictures: countPictures(messages),
    sentPictures: countPictures(sentMessages),
    receivedPictures: countPictures(receivedMessages),
    totalVideos: countVideos(messages),
    sentVideos: countVideos(sentMessages),
    receivedVideos: countVideos(receivedMessages),
    totalGIFs: countGIFs(messages),
    sentGIFs: countGIFs(sentMessages),
    receivedGIFs: countGIFs(receivedMessages),
    totalStickers: countStickers(messages),
    sentStickers: countStickers(sentMessages),
    receivedStickers: countStickers(receivedMessages),
    mostPopularWords,
  };
};

const ConversationStatsRow: React.FC<{
  total: number;
  sent: number;
  received: number;
  title: string;
  showPercent?: boolean;
  precision?: number;
}> = ({ received, sent, title, total, showPercent = true, precision = 0 }) => {
  return (
    <>
      <div>
        <SectionTitle>{title}</SectionTitle>
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total" groupSeparator=" " value={total} precision={precision} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Sent"
              value={sent}
              groupSeparator=" "
              precision={precision}
              prefix={<ArrowUpOutlined />}
              suffix={
                showPercent ? (
                  <NumberSuffix>{` ${Math.round((sent / total) * 10000) / 100}%`}</NumberSuffix>
                ) : null
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Received"
              groupSeparator=" "
              value={received}
              precision={precision}
              prefix={<ArrowDownOutlined />}
              suffix={
                showPercent ? (
                  <NumberSuffix>{` ${Math.round((received / total) * 10000) / 100}%`}</NumberSuffix>
                ) : null
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

interface MostPopularWordsTable {
  word: string;
  count: number;
}

const columns: ColumnsType<MostPopularWordsTable> = [
  {
    key: 'word',
    dataIndex: 'word',
    title: 'Word',
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Count',
  },
];

const ConversationView: React.FC<{ id: string }> = ({ id }) => {
  const [conversations] = useGlobal('conversations');
  const [owner] = useGlobal('owner');
  const conversation = conversations.find((c) => c.id === id);
  const history = useHistory();
  const stats = getConversationStats(conversation.messages, owner);
  return (
    <MainContainer>
      <Button icon={<LeftOutlined />} onClick={() => history.goBack()}>
        Back
      </Button>
      <h1>{conversation.title}</h1>
      <div>
        <ConversationStatsRow
          title="Messages"
          received={stats.receivedMsg}
          sent={stats.sentMsg}
          total={stats.totalMsg}
        />
        <ConversationStatsRow
          title="Words"
          received={stats.totalWordsReceived}
          sent={stats.totalWordsSent}
          total={stats.totalWords}
        />
        <ConversationStatsRow
          title="Average words per message"
          received={stats.avgReceivedMsgLengthInWords}
          sent={stats.avgSentMsgLengthInWords}
          total={stats.avgMsgLengthInWords}
          showPercent={false}
          precision={3}
        />
        <ConversationStatsRow
          title="Chars"
          received={stats.totalCharsReceived}
          sent={stats.totalCharsSent}
          total={stats.totalChars}
        />
        <ConversationStatsRow
          title="Average chars per message"
          received={stats.avgReceivedMsgLengthInChars}
          sent={stats.avgSentMsgLengthInChars}
          total={stats.avgMsgLengthInChars}
          showPercent={false}
          precision={3}
        />
        <ConversationStatsRow
          title="Pictures"
          received={stats.receivedPictures}
          sent={stats.sentPictures}
          total={stats.totalPictures}
        />
        <ConversationStatsRow
          title="Videos"
          received={stats.receivedVideos}
          sent={stats.sentVideos}
          total={stats.totalVideos}
        />
        <ConversationStatsRow
          title="GIFs"
          received={stats.receivedGIFs}
          sent={stats.sentGIFs}
          total={stats.totalGIFs}
        />
        <ConversationStatsRow
          title="Stickers"
          received={stats.receivedStickers}
          sent={stats.sentStickers}
          total={stats.totalStickers}
        />
      </div>
      <Table
        columns={columns}
        dataSource={stats.mostPopularWords}
        rowKey="word"
        title={() => 'Most popular words'}
      />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  padding: 30px;
`;

const NumberSuffix = styled.div`
  font-size: 12px;
`;

const SectionTitle = styled.div`
  padding-top: 10px;
  padding-bottom: 2px;
  font-size: 18px;
  font-weight: bold;
`;

export default ConversationView;
