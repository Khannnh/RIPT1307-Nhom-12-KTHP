import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  getThietBiList,
  getThietBiDetail,
  createThietBi,
  updateThietBi,
  deleteThietBi,
  getDanhMucList,
} from '@/services/QuanLyThietBi';
import { ThietBi, ThietBiParams, DanhMucThietBi } from '@/services/QuanLyThietBi/typing';

export interface ThietBiModelState {
  list: ThietBi[];
  total: number;
  current: ThietBi | null;
  danhMucList: DanhMucThietBi[];
  loading: boolean;
}

export interface ThietBiModelType {
  namespace: 'thietbi';
  state: ThietBiModelState;
  effects: {
    fetchList: Effect;
    fetchDetail: Effect;
    create: Effect;
    update: Effect;
    delete: Effect;
    fetchDanhMuc: Effect;
  };
  reducers: {
    saveList: Reducer<ThietBiModelState>;
    saveCurrent: Reducer<ThietBiModelState>;
    saveDanhMuc: Reducer<ThietBiModelState>;
    setLoading: Reducer<ThietBiModelState>;
  };
}

const ThietBiModel: ThietBiModelType = {
  namespace: 'thietbi',

  state: {
    list: [],
    total: 0,
    current: null,
    danhMucList: [],
    loading: false,
  },

  effects: {
    *fetchList({ type, payload }: { type: string; payload?: ThietBiParams }, { call, put }): Generator {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(getThietBiList, payload);
        yield put({
          type: 'saveList',
          payload: {
            list: response.data || [],
            total: response.total || 0,
          },
        });
      } catch (error) {
        message.error('Không thể tải danh sách thiết bị');
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *fetchDetail({ type, payload }: { type: string; payload?: string }, { call, put }): Generator {
      try {
        if (payload) {
          const response = yield call(getThietBiDetail, payload);
          yield put({
            type: 'saveCurrent',
            payload: response.data,
          });
        }
      } catch (error) {
        message.error('Không thể tải thông tin thiết bị');
      }
    },

    *create({ type, payload, callback }: { type: string; payload?: any; callback?: () => void }, { call, put }): Generator {
      try {
        if (payload) {
          yield call(createThietBi, payload);
          message.success('Thêm thiết bị thành công');
          yield put({ type: 'fetchList', payload: {} });
          if (callback) callback();
        }
      } catch (error) {
        message.error('Không thể thêm thiết bị');
      }
    },

    *update({ type, payload, callback }: { type: string; payload?: { id: string; data: any }; callback?: () => void }, { call, put }): Generator {
      try {
        if (!payload) return;
        yield call(updateThietBi, payload.id, payload.data);
        message.success('Cập nhật thiết bị thành công');
        yield put({ type: 'fetchList', payload: {} });
        callback?.();
      } catch (error) {
        message.error('Không thể cập nhật thiết bị');
      }
    },

    *delete({ type, payload = '', callback }: { type: string; payload?: string; callback?: () => void }, { call, put }): Generator {
      try {
        yield call(deleteThietBi, payload);
        message.success('Xóa thiết bị thành công');
        yield put({ type: 'fetchList', payload: {} });
        callback?.();
      } catch (error) {
        message.error('Không thể xóa thiết bị');
      }
    },

    *fetchDanhMuc(_: { type: string }, { call, put }): Generator {
      try {
        const response = yield call(getDanhMucList);
        yield put({
          type: 'saveDanhMuc',
          payload: response.data || [],
        });
      } catch (error) {
        message.error('Không thể tải danh mục thiết bị');
      }
    },
  },

  reducers: {
    saveList(state = { list: [], total: 0, current: null, danhMucList: [], loading: false }, { payload }) {
      return {
        ...state,
        list: payload.list,
        total: payload.total,
      };
    },

    saveCurrent(state = { list: [], total: 0, current: null, danhMucList: [], loading: false }, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },

    saveDanhMuc(state = { list: [], total: 0, current: null, danhMucList: [], loading: false }, { payload }) {
      return {
        ...state,
        danhMucList: payload,
      };
    },

    setLoading(state = { list: [], total: 0, current: null, danhMucList: [], loading: false }, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },
};

export default ThietBiModel;