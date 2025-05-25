import React from 'react';
import Header from '@/common/header'; // Đường dẫn tới Header component
import Footer from '@/common/footer'; // Đường dẫn tới Footer component
// Import ảnh và CSS cho phần banner
import muonDoImage from '@/assets/muon do.jpg'; 
import '@/common/header.less'; 

const HomePage: React.FC = () => {
  return (
    <div className="home-page-container">
      {/* Sử dụng Header component (chỉ còn thanh điều hướng sticky) */}
      <Header />

      {/* PHẦN BANNER NÀY SẼ CUỘN ĐI KHI BẠN SCROLL XUỐNG DƯỚI */}
      {/* Đây là phần banner đã được di chuyển từ Header.tsx sang */}
      <div className="header-banner">
        <div className="header-text-content">
          <div className="header-description">
            Mượn trả đồ dễ dàng
          </div>
          <div className="header-subtitle">
            Chào mừng bạn đến với hệ thống mượn/ trả đồ sinh viên,nơi bạn có thể dễ dàng mượn và trả đồ dùng học tập và thiết bị cá nhân việc này giúp bạn tiết kiệm chi phí và bảo vệ môi trường
          </div>
        </div>
        <div className="header-image">
          <img src={muonDoImage} alt="He thong muon tra do sinh vien" />
        </div>
      </div>

      {/* Đây là nội dung chính của trang chủ (giữ nguyên tất cả các phần bạn đã có) */}
      <main className="home-content">
        <h1>Welcome to Our Website!</h1>
        <p>This is the main content area of your home page.</p>
        <p>You can add more sections, images, or interactive elements here.</p>
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>Feature 1: Description of feature 1.</li>
            <li>Feature 2: Description of feature 2.</li>
            <li>Feature 3: Description of feature 3.</li>
          </ul>
        </section>
        <section className="about">
          <h2>About Us</h2>
          <p>Learn more about our mission and values.</p>
          <p>We are committed to providing the best service to our users.</p>
        </section>
        <section className="contact">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out!</p>
        </section>
        <section className="news">
          <h2>Latest News</h2>
          <p>Stay updated with our latest news and announcements.</p>
            <ul>
                <li>News 1: Brief description of news 1.</li>
                <li>News 2: Brief description of news 2.</li>
                <li>News 3: Brief description of news 3.</li>
            </ul>
        </section>
        <section className="testimonials">
            <h2>Testimonials</h2>
            <p>What our users say about us:</p>
            <blockquote>
                <p>This website has changed my life! - Happy User</p>
            </blockquote>
            <blockquote>
                <p>Amazing service and support! - Satisfied Customer</p>
            </blockquote>
        </section>
      </main>
      {/* Sử dụng Footer component */}
      <Footer />
    </div>
  );
};

export default HomePage;