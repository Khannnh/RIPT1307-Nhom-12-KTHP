
import React from 'react';
import './DeviceTable.less'; // Tạo file DeviceTable.less cho CSS

interface Device {
  rank: number;
  name: string;
  category: string;
  borrows: number;
  percentage: string;
}

interface DeviceTableProps {
  data: Device[];
}

const DeviceTable: React.FC<DeviceTableProps> = ({ data }) => {
  return (
    <div className="device-table-container">
      <div className="table-header">
        <h3>Bảng Chi Tiết Thống Kê</h3>
        <p>Danh sách thiết bị được mượn trong Tháng 6/2025</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Tên Thiết Bị</th>
            <th>Danh Mục</th>
            <th>Số Lượt Mượn</th>
            <th>Tỷ Lệ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((device) => (
            <tr key={device.rank}>
              <td>#{device.rank}</td>
              <td>{device.name}</td>
              <td><span className={`category-tag ${device.category.toLowerCase().replace(/\s/g, '-')}`}>{device.category}</span></td>
              <td>{device.borrows}</td>
              <td>{device.percentage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceTable;