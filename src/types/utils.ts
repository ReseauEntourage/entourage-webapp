import { NextPageContext } from 'next'
import { Store } from 'src/store'

export type DateISO = string

export interface PageContext extends NextPageContext {
  store: Store;
}

export interface StatelessPage<P = void> extends React.SFC<P> {
  getInitialProps?: (ctx: PageContext) => Promise<P>;
}

export type Parameters<T> = T extends (...args: infer T) => unknown ? T : null;
