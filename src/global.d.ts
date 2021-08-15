import { JSONMessages } from './index';

import 'reactn';

declare module 'reactn/default' {
  export interface State {
    conversations: JSONMessages[];
    owner: string;
  }
}
