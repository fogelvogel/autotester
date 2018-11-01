import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type autotesterStateType = {
  +mode: number,
  +url: string
};

export type Action = {
  +type: string,
  +url: string
};

export type GetState = () => autotesterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
