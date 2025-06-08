// src/components/HeroSection.tsx
import React from 'react';
import './HeroSection.less'; // Tạo file HeroSection.less cho CSS

interface HeroSectionProps {
  totalBorrows: number;
  popularDevice: string;
  popularDeviceBorrows: number;
  uniqueDeviceTypes: number;
  // Các props cho bộ lọc thời gian có thể thêm vào đây nếu cần quản lý trạng thái từ bên ngoài
}

const HeroSection: React.FC<HeroSectionProps> = ({
  totalBorrows,
  popularDevice,
  popularDeviceBorrows,
  uniqueDeviceTypes,
}) => {
  return (
    <div className="hero-section-wrapper">
      {/* Phần bộ lọc thời gian */}
      <div className="time-filter-section">
        <div className="filter-group">
            <span className="icon">📅</span> Bộ lọc thời gian:
        </div>
        <button className="filter-button active">Tuần</button>
        <button className="filter-button active">Tháng</button>
        <button className="filter-button active">Năm</button>
        <select className="filter-dropdown">
            <option>Năm 2023</option>
            <option>Năm 2024</option>
            <option>Năm 2025</option>
        </select>
        <select className="filter-dropdown">
            <option>Tháng 1</option>
            <option>Tháng 2</option>
            <option>Tháng 3</option>
            <option>Tháng 4</option>
            <option>Tháng 5</option>
            <option selected>Tháng 6</option>
            <option>Tháng 7</option>
            <option>Tháng 8</option>
            <option>Tháng 9</option>
            <option>Tháng 10</option>
            <option>Tháng 11</option>
            <option>Tháng 12</option>
        </select>
      </div>

      {/* Các thẻ thống kê chính */}
      <div className="hero-cards-container">
        <div className="card">
          <div className="card-header">
            <h3>Tổng Lượt Mượn</h3>
            <span className="icon">📈</span> {/* Biểu tượng có thể được thay thế bằng SVG */}
          </div>
          <p className="card-value">{totalBorrows}70</p>
          <p className="card-description">Tháng 4 năm 2025</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Thiết Bị Được Mượn Nhiều Nhất</h3>
            <span className="icon">💻</span> {/* Biểu tượng có thể được thay thế bằng SVG */}
          </div>
          <p className="card-value">{popularDevice}48</p>
          <p className="card-description">{popularDeviceBorrows} lượt mượn</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Loại Thiết Bị</h3>
            <span className="icon">📦</span> {/* Biểu tượng có thể được thay thế bằng SVG */}
          </div>
          <p className="card-value">{uniqueDeviceTypes}8</p>
          <p className="card-description">Danh mục khác nhau</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;