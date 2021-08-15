import React from 'react';
import { useParams } from 'react-router-dom';
import ConversationView from './ConversationView';

const ConversationViewRoute: React.FC = () => {
  const {id} = useParams<{id: string}>();
  return <ConversationView id={id}/>
}

export default ConversationViewRoute