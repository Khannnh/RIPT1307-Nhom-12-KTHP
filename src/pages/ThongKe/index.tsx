import React from 'react';
import { Button, Card } from 'antd';
import './index.less';

const HomePage: React.FC = () => {
  return (
    <div className="management-system">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="icon-wrapper">
              <div className="chart-icon"></div>
            </div>
            <h1>LendHub</h1>
          </div>
          <Button type="primary" className="stats-button">
            Xem Thống Kê
          </Button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Thống kê thiết bị mượn nhiều trong tháng</h2>
        <p>
          Theo dõi và phân tích việc sử dụng thiết bị một cách hiệu quả với các báo cáo chi tiết
          và trực quan theo thời gian thực
        </p>
      </div>

      {/* Main Features */}
      <div className="main-features">
        <Card className="feature-card blue-card">
          <div className="feature-icon blue-icon">
            <div className="chart-bars"></div>
          </div>
          <h3>Thống Kê Chi Tiết</h3>
          <p>Xem báo cáo thiết bị được mượn nhiều nhất theo tuần, tháng, năm</p>
          <Button type="primary" className="feature-button blue-button">
            Xem Thống Kê
          </Button>
        </Card>

        <Card className="feature-card green-card">
          <div className="feature-icon green-icon">
            <div className="trend-line"></div>
          </div>
          <h3>Phân Tích Xu Hướng</h3>
          <p>Biểu đồ trực quan giúp hiểu rõ xu hướng sử dụng thiết bị</p>
          <Button className="feature-button green-button">
            Xem Biểu Đồ
          </Button>
        </Card>

        <Card className="feature-card purple-card">
          <div className="feature-icon purple-icon">
            <div className="calendar-icon"></div>
          </div>
          <h3>Lọc Theo Thời Gian</h3>
          <p>Tùy chỉnh khoảng thời gian xem báo cáo một cách linh hoạt</p>
          <Button className="feature-button purple-button">
            Chọn Thời Gian
          </Button>
        </Card>
      </div>

      {/* Featured Functions */}
      <div className="featured-section">
        <h2>Tính Năng Nổi Bật</h2>
        <div className="featured-grid">
          <div className="featured-item">
            <div className="featured-icon blue-icon">
              <div className="chart-bars"></div>
            </div>
            <h4>Báo Cáo Thời Gian Thực</h4>
            <p>Cập nhật dữ liệu liên tục về tình hình sử dụng thiết bị</p>
          </div>

          <div className="featured-item">
            <div className="featured-icon green-icon">
              <div className="trend-line"></div>
            </div>
            <h4>Phân Tích Xu Hướng</h4>
            <p>Hiểu rõ mô hình sử dụng thiết bị</p>
          </div>

          <div className="featured-item">
            <div className="featured-icon purple-icon">
              <div className="calendar-icon"></div>
            </div>
            <h4>Lọc Linh Hoạt</h4>
            <p>Tùy chỉnh theo tuần, tháng, năm</p>
          </div>

          <div className="featured-item">
            <div className="featured-icon orange-icon">
              <div className="chart-bars"></div>
            </div>
            <h4>Giao Diện Trực Quan</h4>
            <p>Dễ sử dụng và thân thiện</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;