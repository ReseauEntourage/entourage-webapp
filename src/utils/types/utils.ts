import { NextPageContext } from 'next'

export type DateISO = string

export interface PageContext extends NextPageContext {}

export interface StatelessPage<P = void> extends React.SFC<P> {
  getInitialProps?: (ctx: PageContext) => Promise<P>;
}

export type Parameters<T> = T extends (...args: infer T) => unknown ? T : null;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyToFix = any;
export type AnyCantFix = any;
/* eslint-enable @typescript-eslint/no-explicit-any */

export type ValueOf<T> = T[keyof T];

type ActionsMapObject = {
  [key: string]: (
    params?: AnyCantFix,
  ) => {
    [key: string]: AnyCantFix;
    type: string;
  };
};

export type ActionsFromMapObject<Actions extends ActionsMapObject> = {
  [key in keyof Actions]: ReturnType<Actions[key]>;
};

export type ActionFromMapObject<Actions extends ActionsMapObject> = ValueOf<
ActionsFromMapObject<Actions>
>;
