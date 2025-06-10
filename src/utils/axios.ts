import { message, notification } from 'antd';
import axios from 'axios';
import { history } from 'umi';
import data from '@/locales/vi-VN';

// Tạo instance axios với baseURL
const instance = axios.create({
	baseURL: 'http://localhost:3456',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Add a request interceptor
instance.interceptors.request.use(
	(config) => {
		console.log('🚀 Axios Request:', {
			url: config.url,
			method: config.method?.toUpperCase(),
			baseURL: config.baseURL,
			fullURL: `${config.baseURL}${config.url}`,
		});

		// Lấy token từ localStorage
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
			console.log('✅ Token added to request');
		} else {
			console.log('❌ No token found');
		}
		return config;
	},
	(error) => {
		console.error('❌ Request interceptor error:', error);
		return Promise.reject(error);
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	(response) => {
		console.log('✅ Axios Response:', {
			url: response.config.url,
			status: response.status,
			data: response.data,
		});
		return response;
	},
	(error) => {
		console.error('❌ Axios Error:', {
			url: error.config?.url,
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});

		const er = error?.response?.data;
		let descriptionError = 'Có lỗi xảy ra';

		try {
			if (er?.detail?.exception?.response?.message && Array.isArray(er.detail.exception.response.message)) {
				descriptionError = er.detail.exception.response.message.join(', ');
			} else if (er?.detail?.exception?.errors && Array.isArray(er.detail.exception.errors)) {
				descriptionError = er.detail.exception.errors.map((e: any) => e?.message || 'Lỗi không xác định').join(', ');
			} else if (er?.detail?.errorCode && data?.error?.[er.detail.errorCode]) {
				descriptionError = data.error[er.detail.errorCode];
			} else if (er?.errorCode && data?.error?.[er.errorCode]) {
				descriptionError = data.error[er.errorCode];
			} else if (er?.detail?.message) {
				descriptionError = er.detail.message;
			} else if (er?.message) {
				descriptionError = er.message;
			} else if (er?.errorDescription) {
				descriptionError = er.errorDescription;
			}
		} catch (parseError) {
			console.error('Error parsing error response:', parseError);
			descriptionError = 'Có lỗi xảy ra khi xử lý phản hồi từ server';
		}

		const originalRequest = error.config;
		let originData = null;

		try {
			originData = originalRequest?.data;
			if (typeof originData === 'string') {
				originData = JSON.parse(originData);
			}
		} catch (parseError) {
			console.error('Error parsing request data:', parseError);
		}

		// Chỉ hiển thị thông báo lỗi nếu không phải là request silent
		const shouldShowNotification = !originData?.silent;

		if (shouldShowNotification) {
			switch (error?.response?.status) {
				case 400:
					notification.error({
						message: 'Dữ liệu chưa đúng',
						description: descriptionError,
					});
					break;

				case 401:
					// Xóa token và chuyển về trang đăng nhập nếu token hết hạn
					localStorage.removeItem('token');
					localStorage.removeItem('user');
					localStorage.removeItem('role');
					notification.error({
						message: 'Phiên đăng nhập đã hết hạn',
						description: 'Vui lòng đăng nhập lại',
					});
					history.push('/auth/login');
					break;

				case 403:
					notification.error({
						message: 'Không có quyền truy cập',
						description: descriptionError,
					});
					break;

				case 404:
					notification.error({
						message: 'Không tìm thấy dữ liệu',
						description: descriptionError,
					});
					break;

				case 409:
					notification.error({
						message: 'Dữ liệu đã tồn tại',
						description: descriptionError,
					});
					break;

				case 500:
				case 502:
					notification.error({
						message: 'Lỗi hệ thống',
						description: descriptionError,
					});
					break;

				default:
					message.error('Hệ thống đang cập nhật. Vui lòng thử lại sau');
					break;
			}
		}

		return Promise.reject(error);
	}
);

export default instance;
