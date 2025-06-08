import { getThietBi, addThietBi, updThietBi, delThietBi } from '@/services/QuanLyThietBi';
import type { ThietBi } from '@/services/QuanLyThietBi/typing';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

// 1. Định nghĩa kiểu cho State
export interface QuanLyThietBiStateType {
  data: ThietBi[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  filter: Record<string, any>;
}

// 2. Định nghĩa kiểu cho Model
export interface QuanLyThietBiModelType {
  namespace: 'quanLyThietBi';
  state: QuanLyThietBiStateType;
  effects: {
    get: Effect;
    add: Effect;
    upd: Effect;
    del: Effect;
  };
  reducers: {
    save: Reducer<QuanLyThietBiStateType>;
  };
}

// 3. Áp dụng kiểu vào Model
const ModelQuanLyThietBi: QuanLyThietBiModelType = {
  namespace: 'quanLyThietBi',
  state: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    filter: {},
  },
  effects: {
    *get({ payload }, { call, put, select }) {
      yield put({ type: 'save', payload: { loading: true } });
      // SỬA LỖI Ở ĐÂY: Thêm kiểu tường minh cho 'filter'
      const filter: Record<string, any> = yield select(
        (state: { quanLyThietBi: QuanLyThietBiStateType }) => state.quanLyThietBi.filter,
      );
      const newPayload = { ...filter, ...payload };
      try {
        const response: { data: ThietBi[]; total: number } = yield call(getThietBi, newPayload);
        yield put({
          type: 'save',
          payload: {
            data: response.data ?? [],
            total: response.total ?? 0,
            page: newPayload.page,
            limit: newPayload.limit,
          },
        });
      } finally {
        yield put({ type: 'save', payload: { loading: false } });
      }
    },
    *add({ payload }, { call, put, select }) {
      const { page, limit } = yield select((state: { quanLyThietBi: QuanLyThietBiStateType }) => state.quanLyThietBi);
      yield call(addThietBi, payload.values);
      message.success('Thêm thiết bị thành công!');
      yield put({ type: 'get', payload: { page, limit } });
    },
    *upd({ payload }, { call, put, select }) {
      const { page, limit } = yield select((state: { quanLyThietBi: QuanLyThietBiStateType }) => state.quanLyThietBi);
      yield call(updThietBi, payload.id, payload.values);
      message.success('Cập nhật thiết bị thành công!');
      yield put({ type: 'get', payload: { page, limit } });
    },
    *del({ payload }, { call, put, select }) {
      const { page, limit } = yield select((state: { quanLyThietBi: QuanLyThietBiStateType }) => state.quanLyThietBi);
      yield call(delThietBi, payload.id);
      message.success('Xóa thiết bị thành công!');
      yield put({ type: 'get', payload: { page, limit } });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default ModelQuanLyThietBi;