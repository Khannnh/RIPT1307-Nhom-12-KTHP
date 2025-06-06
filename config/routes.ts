export default [
	// Auth routes (no layout)
	{
		path: '/auth',
		layout: false,
		routes: [
			{
				path: '/auth/login',
				name: 'login',
				component: './auth/Login',
			},
			{
				path: '/auth/register',
				name: 'register',
				component: './auth/Register',
			},
			{
				path: '/auth',
				redirect: '/auth/login',
			},
		],
	},

	// Admin routes
	{
		path: '/admin',
		name: 'Quản trị',
		icon: 'SettingOutlined',
		access: 'canAdmin',
		routes: [
			{
				path: '/admin/dashboard',
				name: 'Tổng quan',
				icon: 'DashboardOutlined',
				component: './admin/dashboard',
			},
			{
				path: '/admin/devices',
				name: 'Quản lý thiết bị',
				icon: 'AppstoreOutlined',
				component: './admin/devices',
			},
			{
				path: '/admin/borrow-requests',
				name: 'Quản lý yêu cầu mượn',
				icon: 'FileTextOutlined',
				routes: [
					{
						path: '/admin/borrow-requests',
						name: 'Danh sách yêu cầu',
						component: './admin/borrow-requests',
					},
					{
						path: '/admin/borrow-requests/:id',
						name: 'Chi tiết yêu cầu',
						component: './admin/borrow-requests/[id]',
						hideInMenu: true,
					},
				],
			},
			{
				path: '/admin/statistics',
				name: 'Thống kê',
				icon: 'BarChartOutlined',
				component: './admin/statistics',
			},
			{
				path: '/admin/alerts',
				name: 'Cảnh báo',
				icon: 'AlertOutlined',
				component: './admin/alerts',
			},
			{
				path: '/admin',
				redirect: '/admin/dashboard',
			},
		],
	},

	// Student routes
	{
		path: '/student',
		name: 'Sinh viên',
		icon: 'UserOutlined',
		access: 'canStudent',
		routes: [
			{
				path: '/student/dashboard',
				name: 'Trang chủ',
				icon: 'HomeOutlined',
				component: './student/dashboard',
			},
			{
				path: '/student/devices',
				name: 'Danh sách thiết bị',
				icon: 'AppstoreOutlined',
				component: './student/devices',
			},
			{
				path: '/student/borrow-requests',
				name: 'Yêu cầu mượn của tôi',
				icon: 'FileTextOutlined',
				routes: [
					{
						path: '/student/borrow-requests',
						name: 'Danh sách yêu cầu',
						component: './student/borrow-requests',
					},
					{
						path: '/student/borrow-requests/new',
						name: 'Tạo yêu cầu mượn',
						component: './student/borrow-requests/new',
						hideInMenu: true,
					},
					{
						path: '/student/borrow-requests/:id',
						name: 'Chi tiết yêu cầu',
						component: './student/borrow-requests/[id]',
						hideInMenu: true,
					},
				],
			},
			{
				path: '/student/profile',
				name: 'Thông tin cá nhân',
				icon: 'UserOutlined',
				component: './student/profile',
			},
			{
				path: '/student',
				redirect: '/student/dashboard',
			},
		],
	},

	// Landing page (public)
	{
		path: '/',
		component: './LandingPage',
		layout: false,
	},

	// Error pages
	{
		path: '/403',
		component: './exception/403',
		layout: false,
	},
	{
		path: '/404',
		component: './exception/404',
		layout: false,
	},
	{
		path: '/500',
		component: './exception/500',
		layout: false,
	},
	{
		path: '*',
		redirect: '/404',
	},
];
