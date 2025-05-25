import React, { useState } from 'react';
import { Link, history } from 'umi';
import { Button, Card, Row, Col, message } from 'antd';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
}

const productData: Product[] = [
  {
    id: 1,
    name: 'Áo Đoàn',
    description: 'Áo đồng phục của CLB, sử dụng trong các sự kiện',
    image: 'https://dongphucvina.vn/wp-content/uploads/2023/04/ao-thun-doan-thanh-nien-viet-nam.jpg'
  },
  {
    id: 2,
    name: 'Máy Chiếu',
    description: 'Máy chiếu phục vụ cho các buổi hội thảo, sự kiện',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdp9_iF4BebioVDp1TZPLjYqsxP42WcOuwvw&s'
  },
  {
    id: 3,
    name: 'Micro',
    description: 'Micro chất lượng cao, thích hợp cho các buổi thuyết trình',
    image: 'https://vinasound.vn/wp-content/uploads/2021/09/Thumbnail-Micro-Shure-SM58-LC.jpg'
  },
  {
    id: 4,
    name: 'Loa',
    description: 'Loa sử dụng cho các sự kiện ngoài trời và trong nhà',
    image: 'https://paramax.vn/vnt_upload/product/09_2021/loa_full_range_cao_cap_PARAMAX_PRO_V30.jpg'
  },
  {
    id: 5,
    name: 'Bóng đá',
    description: 'Quả bóng đá dùng cho hoạt động thể thao của CLB',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjkufJ85jvZ8GJg6jgBZljheeB5IttaUbzyg&s'
  },
  {
    id: 6,
    name: 'Máy Quay',
    description: 'Máy quay video ghi lại các sự kiện quan trọng',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtP36jsQ9X5fELW4U8rxO8Od-CclWNyegQFw&s'
  }
];

const HomePage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    message.success("Đăng nhập thành công!");
  };

  const handleBorrow = (product: Product) => {
    if (!isLoggedIn) {
      message.info("Vui lòng đăng nhập để mượn đồ dùng.");
      history.push('/login');
      return;
    }
    message.success(`Yêu cầu mượn "${product.name}" đã được gửi.`);
  };

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Danh Sách Đồ Dùng</h1>
        <div>
          {isLoggedIn ? (
            <span>Xin chào, Sinh viên</span>
          ) : (
            <Button type="primary" onClick={handleLogin}>
              Đăng nhập
            </Button>
          )}
        </div>
      </header>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        {productData.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
            >
              <Card.Meta title={product.name} description={product.description} />
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <Button type="primary" onClick={() => handleBorrow(product)}>
                  Mượn
                </Button>
                <Link to={`/products/${product.id}`} style={{ marginLeft: 8 }}>
                  Chi tiết
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;
