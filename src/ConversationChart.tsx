import React from 'react';
import { JSONMessages } from './index';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartData {
  [key: number]: number;
  name: string;
}

enum Interval {
  MONTHLY,
  WEEKLY,
  DAILY,
}

const COLORS = [
  '#4e79a7',
  '#f28e2b',
  '#e15759',
  '#76b7b2',
  '#59a14f',
  '#edc948',
  '#b07aa1',
  '#ff9da7',
  '#9c755f',
  '#bab0ac',
];

const bucketConversations: (conversations: JSONMessages[], interval: Interval) => ChartData[] = (
  conversations,
  interval
) => {
  const first_msg = Math.min(...conversations.map((c) => c.first_msg_timestamp));
  const last_msg = Math.max(...conversations.map((c) => c.last_msg_timestamp));
  if (interval === Interval.MONTHLY) {
    const firstBucket = new Date(first_msg);
    firstBucket.setDate(1);
    firstBucket.setHours(0, 0, 0, 0);
    const lastBucket = new Date(last_msg);
    lastBucket.setDate(1);
    lastBucket.setHours(0, 0, 0, 0);
    const bucketed: ChartData[] = [];
    let currentBucket = new Date(firstBucket.valueOf());
    while (currentBucket.valueOf() <= lastBucket.valueOf()) {
      bucketed.push({
        name: currentBucket.toLocaleDateString(),
      });
      conversations.forEach((c, idx) => {
        bucketed[bucketed.length - 1][idx] = 0;
      });
      currentBucket.setMonth(currentBucket.getMonth() + 1);
    }

    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      currentBucket = new Date(firstBucket.valueOf());
      const nextBucket = new Date(firstBucket.valueOf());
      nextBucket.setMonth(nextBucket.getMonth() + 1);
      let currentBucketId = 0;
      for (const msg of conversation.messages) {
        if (
          msg.timestamp_ms >= currentBucket.valueOf() &&
          msg.timestamp_ms < nextBucket.valueOf()
        ) {
          bucketed[currentBucketId][i] += 1;
        } else {
          while (msg.timestamp_ms > nextBucket.valueOf()) {
            currentBucketId++;
            currentBucket.setMonth(currentBucket.getMonth() + 1);
            nextBucket.setMonth(nextBucket.getMonth() + 1);
          }
        }
      }
    }

    return bucketed;
  }
};

const ConversationChart: React.FC<{ conversations: JSONMessages[]; back: () => void }> = ({
  conversations,
  back,
}) => {
  const interval = Interval.MONTHLY;
  console.log('bucketing for ', conversations.length, ' conversations');
  const bucketed = bucketConversations(conversations, interval);
  console.log('bucketed', bucketed);
  return (
    <div>
      <button onClick={() => back()}>{'< Back'}</button>
      <h1>{conversations.map((c) => c.title).join('; ')}</h1>
      <LineChart
        width={1800}
        height={700}
        data={bucketed}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {conversations.map((c, idx) => (
          <Line
            type="monotone"
            dataKey={idx}
            stroke={idx < COLORS.length - 1 ? COLORS[idx] : COLORS[COLORS.length - 1]}
            activeDot={{ r: 4 }}
            name={c.title}
            key={c.id}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default ConversationChart;
