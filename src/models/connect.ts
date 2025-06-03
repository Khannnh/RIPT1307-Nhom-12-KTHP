import type { ThietBiModelState } from './quanlythietbi/thietbi';

export interface ConnectState {
  thietbi: ThietBiModelState;
  loading: {
    models: {
      thietbi: boolean;
      [key: string]: boolean;
    };
  };
}