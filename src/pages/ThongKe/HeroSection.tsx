import React, { useEffect, useState } from 'react';
import './HeroSection.less';
import { getTotalBorrowRequests } from '@/services/ThongKe/thongKe';

interface HeroSectionProps {
  popularDevice: string;
  popularDeviceBorrows: number;
  uniqueDeviceTypes: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  popularDevice,
  popularDeviceBorrows,
  uniqueDeviceTypes,
}) => {
  const [totalBorrows, setTotalBorrows] = useState<number>(0);

  useEffect(() => {
    getTotalBorrowRequests()
      .then(setTotalBorrows)
      .catch(() => setTotalBorrows(0));
  }, []);

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
          <option>Tháng 6</option>
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
            <span className="icon">📈</span>
          </div>
          <p className="card-value">{totalBorrows}</p>
          <p className="card-description">Tháng 4 năm 2025</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Thiết Bị Được Mượn Nhiều Nhất</h3>
            <span className="icon">💻</span>
          </div>
          <p className="card-value">{popularDevice}</p>
          <p className="card-description">{popularDeviceBorrows} lượt mượn</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Loại Thiết Bị</h3>
            <span className="icon">📦</span>
          </div>
          <p className="card-value">{uniqueDeviceTypes}</p>
          <p className="card-description">Danh mục khác nhau</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;