export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'Random User', 
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
  {
    path: '/thongke-group', // Đây là route cha (không có component)
    name: 'Thống Kê LendHub', // Tên nhóm trong menu
    icon: 'BarChartOutlined', // Icon cho nhóm
    layout: true, // Layout cho cả nhóm
    routes: [
      {
        path: '/thongke-group/admin', // Đường dẫn cho "Thống kê_Quản trị viên"
        name: 'Thống kê Quản trị viên',
        component: '@/pages/ThongKe/index', // Trỏ tới src/pages/ThongKe/index.tsx
        icon: 'BarChartOutlined', 
      },
      {
        path: '/thongke-group/bieudo', // Đường dẫn cho "Thống kê biểu đồ"
        name: 'Thống kê biểu đồ',
        component: '@/pages/ThongKe/DeviceStatisticsPage', // Trỏ tới src/pages/ThongKe/chartPage.tsx
        icon: 'LineChartOutlined', 
      },
    ],
  },
  	{
		path: '/bieudo',
		name: 'Trang Biểu Đồ', 
		component: '@/pages/ThongKe/staticPage',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/yeucaumuon',
		name: 'Gửi yêu cầu mượn',
		//component: './ThongKe',
		icon: 'FileSearchOutlined',
	},
	{
		path: '/thong-tin-ca-nhan',
		name: 'Thông tin cá nhân',
		icon: 'UserOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
