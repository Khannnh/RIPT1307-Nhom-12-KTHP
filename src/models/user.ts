import { Effect, Reducer } from 'umi';
import { loginUser, registerUser } from '@/services/user';

export interface UserModelState {
  currentUser?: any;
  token?: string;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    register: Effect;
    logout: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveToken: Reducer<UserModelState>;
    clearUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: undefined,
    token: undefined,
  },
  effects: {
    *login({ payload }, { call, put }): Generator<any, any, any> {
      const response = yield call(loginUser, payload);
      if (response?.data) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        yield put({
          type: 'saveCurrentUser',
          payload: response.data.user,
        });
        yield put({
          type: 'saveToken',
          payload: response.data.access_token,
        });
      }
      return response;
    },
    *register({ payload }, { call }): Generator<any, any, any> {
      const response = yield call(registerUser, payload);
      return response;
    },
    *logout(_, { put }): Generator<any, any, any> {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      yield put({
        type: 'clearUser',
      });
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload,
      };
    },
    saveToken(state, { payload }) {
      return {
        ...state,
        token: payload,
      };
    },
    clearUser(state) {
      return {
        ...state,
        currentUser: undefined,
        token: undefined,
      };
    },
  },
};

export default UserModel;
