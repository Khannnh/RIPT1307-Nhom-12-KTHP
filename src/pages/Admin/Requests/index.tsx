import React, { useState } from 'react';
import TableBase from '@/components/Table';
import { Tag, Button, Space, Popconfirm, Modal } from 'antd';
import { useDispatch } from 'umi';
import type { YeuCau } from '@/services/QuanLyYeuCau/typing';
import moment from 'moment';
import DetailView from './components/DetailView';
import { EyeOutlined } from '@ant-design/icons';

const RequestsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<YeuCau | undefined>(undefined);

  const handleAction = (id: string, trangThai: YeuCau['trangThai'], successMessage: string) => {
    dispatch({
      type: 'quanLyYeuCau/updateTrangThai',
      payload: { id, trangThai, successMessage },
    });
  };

  const showDetailModal = (record: YeuCau) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  // SỬA LỖI Ở ĐÂY: Thêm thuộc tính 'width' cho mỗi cột
  const columns: any = [
    { title: 'STT', dataIndex: 'index', valueType: 'indexBorder', width: 80 },
    { title: 'Người mượn', dataIndex: ['nguoiMuon', 'ten'], search: true, width: 200 },
    { title: 'Thiết bị', dataIndex: ['thietBi', 'ten'], search: true, width: 220 },
    {
      title: 'Ngày yêu cầu',
      dataIndex: 'ngayYeuCau',
      width: 150,
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 150,
      render: (trangThai: string) => {
        let color = 'default';
        if (trangThai === 'Đã duyệt') color = 'success';
        if (trangThai === 'Đã từ chối') color = 'error';
        if (trangThai === 'Chờ duyệt') color = 'processing';
        if (trangThai === 'Đã lấy') color = 'blue';
        if (trangThai === 'Đã trả') color = 'purple';
        return <Tag color={color}>{trangThai.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Hành động',
      valueType: 'option',
      width: 250,
      fixed: 'right', // Cố định cột hành động ở bên phải
      render: (_: any, record: YeuCau) => (
        <Space>
           <Button icon={<EyeOutlined />} size="small" onClick={() => showDetailModal(record)}>Chi tiết</Button>
          {record.trangThai === 'Chờ duyệt' && (
            <>
              <Popconfirm
                title="Duyệt yêu cầu này?"
                onConfirm={() => handleAction(record._id, 'Đã duyệt', 'Duyệt yêu cầu thành công!')}
              >
                <Button size="small" type="primary">Duyệt</Button>
              </Popconfirm>
              <Popconfirm
                title="Từ chối yêu cầu này?"
                onConfirm={() => handleAction(record._id, 'Đã từ chối', 'Đã từ chối yêu cầu!')}
              >
                <Button size="small" danger>Từ chối</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];
  
  return (
    <>
      <TableBase title="Quản lý yêu cầu mượn" modelName="quanLyYeuCau" columns={columns} />
      {currentRecord && (
         <Modal
            title="Chi tiết yêu cầu mượn"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null} // Không cần nút OK/Cancel
            width={700}
         >
           <DetailView record={currentRecord} />
         </Modal>
      )}
    </>
  );
};

export default RequestsPage;