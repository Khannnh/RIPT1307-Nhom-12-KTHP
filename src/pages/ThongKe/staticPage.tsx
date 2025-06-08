// 'use client'
// import type React from 'react'
// import { useState } from 'react'
// import { Button, Card, Select, Row, Col } from 'antd'
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
// import {
//   BarChartOutlined,
//   RiseOutlined,
//   CalendarOutlined,
//   TableOutlined,
//   FallOutlined,
//   PieChartOutlined,
// } from '@ant-design/icons';
// import './static.less';

// const { Option } = Select;

// // Sample data
// const equipmentData = [
//   { name: 'Laptop Dell', value: 145, color: '#4285f4' },
//   { name: 'Máy chiếu', value: 120, color: '#8e24aa' },
//   { name: 'Camera Canon', value: 98, color: '#34a853' },
//   { name: 'Máy in HP', value: 85, color: '#ff9800' },
//   { name: 'Loa Bluetooth', value: 72, color: '#f44336' },
//   { name: 'Tai nghe', value: 65, color: '#6366f1' },
//   { name: 'Ổ cứng di động', value: 58, color: '#10b981' },
//   { name: 'Chuột không dây', value: 45, color: '#f59e0b' },
// ]

// const HomePage: React.FC = () => {
//   const [timePeriod, setTimePeriod] = useState('month')
//   const [selectedYear, setSelectedYear] = useState('2025')
//   const [selectedMonth, setSelectedMonth] = useState('6')
//   const [chartType, setChartType] = useState('column')

//   const summaryData = [
//     {
//       title: 'Tổng Lượt Mượn',
//       value: '897',
//       subtitle: 'Lượt mượn',
//       trend: 'up',
//       trendValue: '+12%',
//       color: '#4285f4',
//     },
//     {
//       title: 'Thiết Bị Phổ Biến Nhất',
//       value: 'Laptop',
//       subtitle: 'Thiết bị hàng đầu',
//       trend: 'up',
//       trendValue: '+8%',
//       color: '#34a853',
//     },
//     {
//       title: 'Loại Thiết Bị',
//       value: '4',
//       subtitle: 'Danh mục thiết bị',
//       trend: 'down',
//       trendValue: '-2%',
//       color: '#8e24aa',
//     },
//   ]

//   const scrollToStatistics = () => {
//     const element = document.getElementById('statistics-section')
//     element?.scrollIntoView({ behavior: 'smooth' })
//   }

//   const renderChart = () => {
//     switch (chartType) {
//       case 'column':
//         return (
//           <ResponsiveContainer width='100%' height={400}>
//             <BarChart data={equipmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
//               <CartesianGrid strokeDasharray='3 3' />
//               <XAxis dataKey='name' angle={-45} textAnchor='end' height={80} fontSize={12} />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey='value' fill={(entry) => entry.color} />
//             </BarChart>
//           </ResponsiveContainer>
//         )
//       case 'pie':
//         return (
//           <ResponsiveContainer width='100%' height={400}>
//             <PieChart>
//               <Pie
//                 data={equipmentData}
//                 cx='50%'
//                 cy='50%'
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={120}
//                 fill='#8884d8'
//                 dataKey='value'
//               >
//                 {equipmentData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         )
//       case 'table':
//         return (
//           <div className='equipment-table'>
//             <div className='table-header'>
//               <div className='table-cell'>Thiết Bị</div>
//               <div className='table-cell'>Số Lượt Mượn</div>
//               <div className='table-cell'>Tỷ Lệ</div>
//             </div>
//             {equipmentData.map((item, index) => (
//               <div key={index} className='table-row'>
//                 <div className='table-cell'>
//                   <div className='equipment-name'>
//                     <div className='color-indicator' style={{ backgroundColor: item.color }}></div>
//                     {item.name}
//                   </div>
//                 </div>
//                 <div className='table-cell'>{item.value}</div>
//                 <div className='table-cell'>
//                   {((item.value / equipmentData.reduce((sum, eq) => sum + eq.value, 0)) * 100).toFixed(1)}%
//                 </div>
//               </div>
//             ))}
//           </div>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <div className='home-page'>
//       {/* Header */}
//       <div className='header'>
//         <div className='header-content'>
//           <div className='header-left'>
//             <div className='icon-wrapper'>
//               <BarChartOutlined />
//             </div>
//             <h1>Hệ Thống Quản Lý Thiết Bị</h1>
//           </div>
//           <Button type='primary' className='stats-button' onClick={scrollToStatistics}>
//             Xem Thống Kê
//           </Button>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className='hero-section'>
//         <h2>Chào Mừng Đến Với Hệ Thống Quản Lý</h2>
//         <p>
//           Theo dõi và phân tích việc sử dụng thiết bị một cách hiệu quả với các báo cáo chi tiết và trực quan theo thời
//           gian thực
//         </p>
//       </div>

//       {/* Main Features */}
//       <div className='main-features'>
//         <Card className='feature-card blue-card' onClick={scrollToStatistics}>
//           <div className='feature-icon blue-icon'>
//             <BarChartOutlined />
//           </div>
//           <h3>Thống Kê Chi Tiết</h3>
//           <p>Xem báo cáo thiết bị được mượn nhiều nhất theo tuần, tháng, năm</p>
//           <Button type='primary' className='feature-button blue-button'>
//             Xem Thống Kê
//           </Button>
//         </Card>

//         <Card className='feature-card green-card' onClick={scrollToStatistics}>
//           <div className='feature-icon green-icon'>
//             <RiseOutlined />
//           </div>
//           <h3>Phân Tích Xu Hướng</h3>
//           <p>Biểu đồ trực quan giúp hiểu rõ xu hướng sử dụng thiết bị</p>
//           <Button className='feature-button green-button'>Xem Biểu Đồ</Button>
//         </Card>

//         <Card className='feature-card purple-card' onClick={scrollToStatistics}>
//           <div className='feature-icon purple-icon'>
//             <CalendarOutlined />
//           </div>
//           <h3>Lọc Theo Thời Gian</h3>
//           <p>Tùy chỉnh khoảng thời gian xem báo cáo một cách linh hoạt</p>
//           <Button className='feature-button purple-button'>Chọn Thời Gian</Button>
//         </Card>
//       </div>

//       {/* Featured Functions */}
//       <div className='featured-section'>
//         <h2>Tính Năng Nổi Bật</h2>
//         <div className='featured-grid'>
//           <div className='featured-item'>
//             <div className='featured-icon blue-icon'>
//               <BarChartOutlined />
//             </div>
//             <h4>Báo Cáo Thời Gian Thực</h4>
//             <p>Cập nhật dữ liệu liên tục về tình hình sử dụng thiết bị</p>
//           </div>

//           <div className='featured-item'>
//             <div className='featured-icon green-icon'>
//               <RiseOutlined />
//             </div>
//             <h4>Phân Tích Xu Hướng</h4>
//             <p>Hiểu rõ mô hình sử dụng thiết bị</p>
//           </div>

//           <div className='featured-item'>
//             <div className='featured-icon purple-icon'>
//               <CalendarOutlined />
//             </div>
//             <h4>Lọc Linh Hoạt</h4>
//             <p>Tùy chỉnh theo tuần, tháng, năm</p>
//           </div>

//           <div className='featured-item'>
//             <div className='featured-icon orange-icon'>
//               <TableOutlined />
//             </div>
//             <h4>Giao Diện Trực Quan</h4>
//             <p>Dễ sử dụng và thân thiện</p>
//           </div>
//         </div>
//       </div>

//       {/* Statistics Section */}
//       <div id='statistics-section' className='statistics-section'>
//         <div className='statistics-header'>
//           <div className='header-icon'>
//             <BarChartOutlined />
//           </div>
//           <div className='header-text'>
//             <h2>Thống Kê Thiết Bị</h2>
//             <p>Theo dõi và phân tích thiết bị được mượn nhiều nhất theo tuần, tháng và năm</p>
//           </div>
//         </div>

//         {/* Filters */}
//         <Card className='filter-card'>
//           <div className='filter-section'>
//             <div className='filter-group'>
//               <span className='filter-label'>Bộ lọc thời gian:</span>
//               <div className='time-buttons'>
//                 <Button type={timePeriod === 'week' ? 'primary' : 'default'} onClick={() => setTimePeriod('week')}>
//                   Tuần
//                 </Button>
//                 <Button type={timePeriod === 'month' ? 'primary' : 'default'} onClick={() => setTimePeriod('month')}>
//                   Tháng
//                 </Button>
//                 <Button type={timePeriod === 'year' ? 'primary' : 'default'} onClick={() => setTimePeriod('year')}>
//                   Năm
//                 </Button>
//               </div>
//             </div>

//             <div className='filter-group'>
//               <Select value={selectedYear} onChange={setSelectedYear} className='year-select'>
//                 <Option value='2023'>Năm 2023</Option>
//                 <Option value='2024'>Năm 2024</Option>
//                 <Option value='2025'>Năm 2025</Option>
//               </Select>

//               {timePeriod === 'month' && (
//                 <Select value={selectedMonth} onChange={setSelectedMonth} className='month-select'>
//                   <Option value='1'>Tháng 1</Option>
//                   <Option value='2'>Tháng 2</Option>
//                   <Option value='3'>Tháng 3</Option>
//                   <Option value='4'>Tháng 4</Option>
//                   <Option value='5'>Tháng 5</Option>
//                   <Option value='6'>Tháng 6</Option>
//                   <Option value='7'>Tháng 7</Option>
//                   <Option value='8'>Tháng 8</Option>
//                   <Option value='9'>Tháng 9</Option>
//                   <Option value='10'>Tháng 10</Option>
//                   <Option value='11'>Tháng 11</Option>
//                   <Option value='12'>Tháng 12</Option>
//                 </Select>
//               )}
//             </div>
//           </div>
//         </Card>

//         {/* Summary Cards */}
//         <Row gutter={[24, 24]} className='summary-section'>
//           {summaryData.map((item, index) => (
//             <Col xs={24} sm={8} key={index}>
//               <Card className='summary-card'>
//                 <div className='summary-content'>
//                   <div className='summary-header'>
//                     <span className='summary-title'>{item.title}</span>
//                     <div className={`trend-indicator ${item.trend}`}>
//                       {item.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
//                     </div>
//                   </div>
//                   <div className='summary-value' style={{ color: item.color }}>
//                     {item.value}
//                   </div>
//                   <div className='summary-footer'>
//                     <span className='summary-subtitle'>{item.subtitle}</span>
//                     <span className={`trend-value ${item.trend}`}>{item.trendValue}</span>
//                   </div>
//                 </div>
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         {/* Chart Type Buttons */}
//         <div className='chart-controls'>
//           <Button
//             type={chartType === 'column' ? 'primary' : 'default'}
//             icon={<BarChartOutlined />}
//             onClick={() => setChartType('column')}
//             className='chart-button'
//           >
//             Biểu Đồ Cột
//           </Button>
//           <Button
//             type={chartType === 'pie' ? 'primary' : 'default'}
//             icon={<PieChartOutlined />}
//             onClick={() => setChartType('pie')}
//             className='chart-button'
//           >
//             Biểu Đồ Tròn
//           </Button>
//           <Button
//             type={chartType === 'table' ? 'primary' : 'default'}
//             icon={<TableOutlined />}
//             onClick={() => setChartType('table')}
//             className='chart-button'
//           >
//             Bảng Chi Tiết
//           </Button>
//         </div>

//         {/* Main Chart */}
//         <Card className='chart-card'>
//           <div className='chart-header'>
//             <h3>Biểu Đồ Thiết Bị Được Mượn Nhiều Nhất</h3>
//             <p>Dữ liệu theo {timePeriod === 'week' ? 'tuần' : timePeriod === 'month' ? 'tháng' : 'năm'}</p>
//           </div>
//           <div className='chart-container'>{renderChart()}</div>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default HomePage;
