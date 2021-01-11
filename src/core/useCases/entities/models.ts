import { FeedItemEntourage } from 'src/core/api'

export type Entourage = {
  data: {
    author: number;
  } & Omit<FeedItemEntourage['data'], 'author'>;
} & Omit<FeedItemEntourage, 'data'>

export interface User {
  id: number;
  avatarUrl: string;
  displayName: string;
  partner: null;
}

