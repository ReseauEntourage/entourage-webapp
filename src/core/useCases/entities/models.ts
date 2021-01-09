import { FeedItemEntourage } from 'src/core/api'

export type Entourage = {
  author: number;
} & Omit<FeedItemEntourage['data'], 'author'>

export interface User {
  id: number;
  avatarUrl: string;
  displayName: string;
  partner: null;
}

