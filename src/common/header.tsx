import React from 'react';
import './header.less'; // Import file CSS/Less cho Header


// Lưu ý: Không còn import muonDoImage ở đây vì ảnh đã được di chuyển sang index.tsx
const Header: React.FC = () => {
  return (
    <header className="main-header">
      {/* Phần Header chính: Thanh điều hướng màu trắng (SẼ LUÔN HIỂN THỊ KHI CUỘN) */}
      <div className="header-content">
        <div className="logo">
          {/* Thay thế bằng logo của bạn, ví dụ: */}
          <a href="/">Hệ thống mượn/trả đồ sinh viên</a>
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li> {/* Thay thế bằng các đường dẫn thực tế */}
            <li><a href="/about">History</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          {/* Ví dụ: nút Login/Register */}
          <button>Login</button>
          <button>Register</button>
        </div>
      </div>

      {/* PHẦN BANNER ĐÃ ĐƯỢC DI CHUYỂN HOÀN TOÀN KHỎI FILE NÀY */}
    </header>
  );
};

export default Header;