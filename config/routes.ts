export default [
	// Auth routes - Không cần đăng nhập
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/auth/login',
				name: 'Đăng nhập',
				component: '@/pages/user/Login',
				exact: true,
			},
			{
				path: '/user/auth/register',
				name: 'Đăng ký',
				component: '@/pages/user/Register',
				exact: true,
			},
			{
				path: '/user',
				component: '@/pages/user/Login',
				exact: true,
			},
		],
	},

	// Main menu routes - Cần đăng nhập
	{
		path: '/',
		component: '@/layouts/BasicLayout',
		routes: [
			// Trang chủ
			{
				path: '/dashboard',
				name: 'Trang chủ',
				icon: 'HomeOutlined',
				component: '@/pages/Home',
				exact: true,
			},

			// Quản lý thiết bị
			{
				name: 'Quản lý thiết bị',
				icon: 'AppstoreOutlined',
				path: '/devices',
				routes: [
					{
						path: '/devices',
						name: 'Danh sách thiết bị',
						component: '@/pages/Devices',
						exact: true,
					},
					{
						path: '/devices/borrow',
						name: 'Mượn thiết bị',
						component: '@/pages/MuonDo/home',
						exact: true,
					},
					{
						path: '/devices/history',
						name: 'Lịch sử mượn trả',
						component: '@/pages/History',
						exact: true,
					},
				],
			},

			// Thống kê
			{
				path: '/statistics',
				name: 'Thống kê',
				icon: 'BarChartOutlined',
				component: '@/pages/Statistics',
				exact: true,
			},

			// Thông tin cá nhân
			{
				path: '/profile',
				name: 'Thông tin cá nhân',
				icon: 'UserOutlined',
				component: '@/pages/Profile',
				exact: true,
			},

			// Giới thiệu
			{
				path: '/about',
				name: 'Giới thiệu',
				icon: 'InfoCircleOutlined',
				component: '@/pages/About',
				hideInMenu: true,
				exact: true,
			},

			// Notification routes
			{
				path: '/notification',
				routes: [
					{
						path: '/notification/subscribe',
						component: '@/pages/ThongBao/Subscribe',
						exact: true,
					},
					{
						path: '/notification/check',
						component: '@/pages/ThongBao/Check',
						exact: true,
					},
					{
						path: '/notification',
						component: '@/pages/ThongBao/NotifOneSignal',
						exact: true,
					},
				],
				layout: false,
				hideInMenu: true,
			},

			// Error pages
			{
				path: '/403',
				component: '@/pages/exception/403',
				layout: false,
				exact: true,
			},
			{
				path: '/404',
				component: '@/pages/exception/404',
				layout: false,
				exact: true,
			},
			{
				path: '/hold-on',
				component: '@/pages/exception/DangCapNhat',
				layout: false,
				exact: true,
			},

			// Root path
			{
				path: '/',
				component: '@/pages/Home',
				exact: true,
			},

			// 404 fallback
			{
				component: '@/pages/exception/404',
			},
		],
	},
];