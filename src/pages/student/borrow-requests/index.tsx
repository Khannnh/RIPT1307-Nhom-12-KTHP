import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Tag, Space, Typography, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IBorrowRequest } from '@/types/borrow-request';
import { BORROW_REQUEST_STATUS } from '@/constants/borrow-request';
import { borrowRequestService } from '@/services/borrow-request';
import styles from './index.module.less';

const StudentBorrowRequests: React.FC = () => {
  // ... existing code ...

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography.Title level={2} className={styles.title}>
          Danh sách yêu cầu mượn thiết bị
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/student/borrow-requests/new')}
        >
          Tạo yêu cầu mượn
        </Button>
      </div>

      <Card className={styles.filterBar}>
        {/* ... existing filter form code ... */}
      </Card>

      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} yêu cầu`,
          }}
        />
      </Card>

      <Modal
        title="Xác nhận hủy yêu cầu"
        visible={cancelModalVisible}
        onOk={handleCancel}
        onCancel={() => setCancelModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={cancelLoading}
      >
        <p>Bạn có chắc chắn muốn hủy yêu cầu mượn này không?</p>
      </Modal>
    </div>
  );
};

export default StudentBorrowRequests;
