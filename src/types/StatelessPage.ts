import { NextPageContext } from 'next'

export interface StatelessPage<P = void> extends React.SFC<P> {
  getInitialProps?: (ctx: NextPageContext) => Promise<P>;
}
