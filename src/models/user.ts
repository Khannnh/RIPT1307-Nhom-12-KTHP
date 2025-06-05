import { Effect, Reducer } from 'umi';
import { loginUser, registerUser, loginAdmin } from '@/services/user';

export interface UserModelState {
  currentUser?: any;
  token?: string;
  role?: string;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    loginUnified: Effect;
    register: Effect;
    logout: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveToken: Reducer<UserModelState>;
    saveRole: Reducer<UserModelState>;
    clearUser: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    currentUser: undefined,
    token: undefined,
    role: undefined,
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

    *loginUnified({ payload }, { call, put }): Generator<any, any, any> {
      console.log('Attempting unified login with:', { username: payload.username });
      
      // Thử đăng nhập với tư cách admin trước
      try {
        console.log('Trying admin login first...');
        const adminResponse = yield call(loginAdmin, payload);
        
        console.log('Admin login response:', adminResponse?.data ? 'Success' : 'Failed');
        
        if (adminResponse?.data?.access_token) {
          console.log('Admin login successful, setting tokens and redirecting');
          localStorage.setItem('token', adminResponse.data.access_token);
          localStorage.setItem('admin_token', adminResponse.data.access_token);
          localStorage.setItem('user', JSON.stringify(adminResponse.data.user || {}));
          localStorage.setItem('role', 'admin');
          
          yield put({
            type: 'saveCurrentUser',
            payload: adminResponse.data.user || {},
          });
          yield put({
            type: 'saveToken',
            payload: adminResponse.data.access_token,
          });
          yield put({
            type: 'saveRole',
            payload: 'admin',
          });
          
          return { ...adminResponse.data, role: 'admin' };
        }
      } catch (error: any) {
        console.error('Admin login error details:', error.response?.data || error.message);
        // Nếu đăng nhập admin thất bại, tiếp tục thử đăng nhập user
      }
      
      // Thử đăng nhập với tư cách user
      try {
        console.log('Trying user login...');
        const userResponse = yield call(loginUser, payload);
        
        console.log('User login response:', userResponse?.data ? 'Success' : 'Failed');
        
        if (userResponse?.data?.access_token) {
          console.log('User login successful, setting tokens and redirecting');
          localStorage.setItem('token', userResponse.data.access_token);
          localStorage.setItem('user', JSON.stringify(userResponse.data.user || {}));
          localStorage.setItem('role', 'user');
          
          yield put({
            type: 'saveCurrentUser',
            payload: userResponse.data.user || {},
          });
          yield put({
            type: 'saveToken',
            payload: userResponse.data.access_token,
          });
          yield put({
            type: 'saveRole',
            payload: 'user',
          });
          
          return { ...userResponse.data, role: 'user' };
        }
      } catch (error: any) {
        console.error('User login error details:', error.response?.data || error.message);
        // Nếu đăng nhập user cũng thất bại, ném lỗi
      }
      
      // Nếu cả hai đều thất bại, ném lỗi
      console.error('Both admin and user login failed');
      throw new Error('Tài khoản hoặc mật khẩu không đúng!');
    },

    *register({ payload }, { call }): Generator<any, any, any> {
      const response = yield call(registerUser, payload);
      return response;
    },

    *logout(_, { put }): Generator<any, any, any> {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
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
    saveRole(state, { payload }) {
      return {
        ...state,
        role: payload,
      };
    },
    clearUser(state) {
      return {
        ...state,
        currentUser: undefined,
        token: undefined,
        role: undefined,
      };
    },
  },
};

export default UserModel;
