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
      if (response?.data.data) {
        localStorage.setItem('token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        yield put({
          type: 'saveCurrentUser',
          payload: response.data.data.user,
        });
        yield put({
          type: 'saveToken',
          payload: response.data.data.access_token,
        });
      }
      return response;
    },

    *loginUnified({ payload }, { call, put }): Generator<any, any, any> {
    // Thử đăng nhập với tư cách admin trước
    try {
        console.log('Attempting admin login with payload:', payload);
        const adminResponse = yield call(loginAdmin, payload);
        console.log('Raw adminResponse from loginAdmin service (after calling loginAdmin):', adminResponse);

        // *** ĐIỀU CHỈNH CÁCH TRUY CẬP DATA TẠI ĐÂY ***
        // Dựa vào ảnh Postman và logic thông thường, token sẽ nằm trong adminResponse.data.data.access_token
        // hoặc adminResponse.data.access_token tùy cách middleware xử lý.
        // NHƯNG CONSOLE LOG CỦA BẠN LẠI HIỆN data: {} nhưng LẠI CÓ DÒNG ADMIN LOGIN SUCCESSFUL. RESPONSE DATA: ...
        // Điều này gợi ý rằng data đã được "unwrap" ở đâu đó HOẶC cấu trúc có thể là data.access_token
        // Chúng ta sẽ thử truy cập theo cách Postman hiển thị: response.data.data.access_token
        // hoặc nếu không được thì là response.data.access_token

        // Vì bạn thấy "Admin login successful. Response data: {access_token: '...'}"
        // điều này có nghĩa là response mà bạn đang put vào log đó đã có access_token.
        // Có thể nó là adminResponse.data.data trực tiếp, hoặc một biến tạm nào đó.

        // THAY ĐỔI CÁCH TRUY CẬP ĐỂ ĐẢM BẢO LẤY ĐÚNG ACCESS_TOKEN VÀ USER
        // Dựa vào dòng "Admin login successful. Response data: {access_token: '...'}" trong console của bạn
        // Có vẻ như nó đang log từ một biến `response.data.data` (nếu model có `response.data.data`)
        // HOẶC có thể là `response.data` nếu `data` kia là field rỗng

        // CÁCH 1: Giả sử DVA model đã "unwrap" giúp và `adminResponse.data` CHÍNH LÀ data mà Postman trả về
        // (tức là adminResponse.data là { message: "...", data: { access_token: "..." } })
        // Nếu vậy, bạn cần truy cập adminResponse.data.data.access_token

        // CÁCH 2: Nếu console log "Raw adminResponse from loginAdmin service:" là đúng, và `adminResponse.data.data` là rỗng,
        // thì có lẽ `access_token` và `user` nằm trực tiếp trong `adminResponse.data`.
        // Dựa vào ảnh Postman, đó là {"message": "Đăng nhập thành công", "data": {"access_token": "...", ...}}.
        // VẬY, adminResponse.data.data.access_token là ĐÚNG theo Postman.
        // NHƯNG console lại nói data: {}

        // => Khả năng cao nhất là: Cấu trúc của `adminResponse` sau `yield call(loginAdmin, payload);`
        // KHÔNG GIỐNG HỆT với `response` từ Postman, hoặc `axios` đã bọc thêm một lớp.

        // HÃY THỬ CÁCH NÀY, dựa vào dòng "Admin login successful. Response data: {access_token: '...', ...}"
        // => Điều này có nghĩa là biến mà bạn đang log ở dòng 60 đã có access_token.
        // Biến đó phải là `adminResponse.data.data` (nếu cấu trúc là data.data)
        // hoặc `adminResponse.data` (nếu cấu trúc là data).

        // Để an toàn, hãy thử kiểm tra cả hai khả năng:
        const responseData = adminResponse?.data?.data || adminResponse?.data; // Ưu tiên data.data, nếu không có thì thử data

        if (responseData?.access_token) { // Kiểm tra access_token trong responseData đã được "unwrap"
            console.log('Admin login successful. Final data being processed:', responseData);
            const accessToken = responseData.access_token;
            const user = responseData.user || {}; // Giả sử user info nằm trong responseData.user
            const role = 'admin'; // Hoặc responseData.role nếu backend trả về

            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', role);

            yield put({ type: 'saveCurrentUser', payload: user });
            yield put({ type: 'saveToken', payload: accessToken });
            yield put({ type: 'saveRole', payload: role });

            return { ...responseData, role: role };
        } else {
            console.log('Admin login failed: No access_token in responseData or condition not met.', responseData);
        }
    } catch (error: any) {
        console.log('Admin login error caught in effect:', error?.response?.data || error.message);
    }

    // Thử đăng nhập với tư cách user thường (kiểm tra và sửa tương tự nếu cần)
    try {
      const userResponse = yield call(loginUser, payload);
      const userData = userResponse?.data?.data || userResponse?.data; // Tương tự cho user login

      if (userData?.access_token) {
        console.log('User login successful. Final data being processed:', userData);
        const accessToken = userData.access_token;
        const user = userData.user || {};
        const role = 'user';

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', role);

        yield put({ type: 'saveCurrentUser', payload: user });
        yield put({ type: 'saveToken', payload: accessToken });
        yield put({ type: 'saveRole', payload: role });

        return { ...userData, role: role };
      } else {
          console.log('User login failed: No access_token in userData or condition not met.', userData);
      }
    } catch (error: any) {
        console.log('User login error:', error?.response?.data || error.message);
    }

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
