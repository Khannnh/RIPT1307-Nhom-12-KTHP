import { getYeuCau, updateTrangThaiYeuCau } from '@/services/QuanLyYeuCau';
import type { YeuCau } from '@/services/QuanLyYeuCau/typing';
import { message } from 'antd';
import type { Effect, Reducer } from 'umi';

// 1. Định nghĩa kiểu cho State
export interface QuanLyYeuCauStateType {
  data: YeuCau[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
}

// 2. Định nghĩa kiểu cho Model
export interface QuanLyYeuCauModelType {
  namespace: 'quanLyYeuCau';
  state: QuanLyYeuCauStateType;
  effects: {
    get: Effect;
    updateTrangThai: Effect;
  };
  reducers: {
    save: Reducer<QuanLyYeuCauStateType>;
  };
}

// 3. Áp dụng kiểu vào Model
const ModelQuanLyYeuCau: QuanLyYeuCauModelType = {
  namespace: 'quanLyYeuCau',
  state: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
  },
  effects: {
    *get({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      try {
        // Sửa lỗi 'yield' expression bằng cách thêm kiểu tường minh
        const response: { data: YeuCau[]; total: number } = yield call(getYeuCau, payload);
        yield put({
          type: 'save',
          payload: {
            data: response.data ?? [],
            total: response.total ?? 0,
            page: payload.page,
            limit: payload.limit,
          },
        });
      } finally {
        yield put({ type: 'save', payload: { loading: false } });
      }
    },
    *updateTrangThai({ payload }, { call, put, select }) {
      const { id, trangThai, successMessage } = payload;
      yield call(updateTrangThaiYeuCau, id, trangThai);
      message.success(successMessage);
      const { page, limit } = yield select(
        (state: { quanLyYeuCau: QuanLyYeuCauStateType }) => state.quanLyYeuCau,
      );
      yield put({ type: 'get', payload: { page, limit } });
    },
  },
  reducers: {
    // Lỗi 'state' implicitly has an 'any' type được khắc phục nhờ Reducer<QuanLyYeuCauStateType>
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default ModelQuanLyYeuCau;