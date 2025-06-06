
import React, { useState } from 'react';
import { Button, Tag, Space, Drawer, Descriptions, Modal, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import moment from 'moment';
import { ETrangThaiThietBi, ELoaiThietBi } from '@/services/MuonDo/constant';
import type { IColumn } from '@/components/Table/typing';
import ThietBiForm from './components/ThietBiForm';

const ThietBi: React.FC = () => {
  const { danhSach, loading, page, limit, total, getData, tao, capNhat, xoa, capNhatSoLuongModel } = useModel('muondo.thietbi');
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MuonDo.IThietBi | null>(null);
  const [visibleCapNhatSoLuong, setVisibleCapNhatSoLuong] = useState(false);
  const [soLuongMoi, setSoLuongMoi] = useState<number>(0);

  const getTrangThaiColor = (trangThai: ETrangThaiThietBi) => {
    switch (trangThai) {
      case ETrangThaiThietBi.HOAT_DONG: return 'success';
      case ETrangThaiThietBi.BAO_TRI: return 'warning';
      case ETrangThaiThietBi.HONG: return 'error';
      default: return 'default';
    }
  };

  const getTrangThaiText = (trangThai: ETrangThaiThietBi) => {
    switch (trangThai) {
      case ETrangThaiThietBi.HOAT_DONG: return 'Hoạt động';
      case ETrangThaiThietBi.BAO_TRI: return 'Bảo trì';
      case ETrangThaiThietBi.HONG: return 'Hỏng';
      default: return 'Không xác định';
    }
  };

  const getLoaiThietBiText = (loai: ELoaiThietBi) => {
    switch (loai) {
      case ELoaiThietBi.DIEN_TU: return 'Điện tử';
      case ELoaiThietBi.VAN_PHONG_PHAM: return 'Văn phòng phẩm';
      case ELoaiThietBi.THE_THAO: return 'Thể thao';
      case ELoaiThietBi.KHAC: return 'Khác';
      default: return 'Không xác định';
    }
  };

  const handleDelete = (record: MuonDo.IThietBi) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa thiết bị "${record.tenThietBi}"?`,
      onOk: () => xoa(record._id),
    });
  };

  const handleCapNhatSoLuong = () => {
    if (selectedRecord) {
      capNhatSoLuongModel(selectedRecord._id, soLuongMoi);
      setVisibleCapNhatSoLuong(false);
    }
  };

  const columns: IColumn<MuonDo.IThietBi>[] = [
    {
      title: 'Mã thiết bị',
      dataIndex: 'maThietBi',
      width: 120,
      filterType: 'string',
    },
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Loại thiết bị',
      dataIndex: 'loaiThietBi',
      width: 120,
      render: (value: ELoaiThietBi) => getLoaiThietBiText(value),
    },
    {
      title: 'Số lượng tồn kho',
      dataIndex: 'soLuongTonKho',
      width: 120,
      align: 'center',
    },
    {
      title: 'Số lượng đang mượn',
      dataIndex: 'soLuongDangMuon',
      width: 130,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 120,
      align: 'center',
      render: (value: ETrangThaiThietBi) => (
        <Tag color={getTrangThaiColor(value)}>{getTrangThaiText(value)}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (record: MuonDo.IThietBi) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setVisibleDetail(true);
            }}
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setVisibleForm(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="link"
            style={{ color: '#52c41a' }}
            onClick={() => {
              setSelectedRecord(record);
              setSoLuongMoi(record.soLuongTonKho);
              setVisibleCapNhatSoLuong(true);
            }}
          >
            Cập nhật SL
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedRecord(null);
            setVisibleForm(true);
          }}
        >
          Thêm thiết bị
        </Button>
      </div>

      <TableBase
        columns={columns}
        dataSource={danhSach}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (page, size) => getData({ page, limit: size }),
        }}
        scroll={{ x: 1000 }}
        rowKey="_id"
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết thiết bị"
        open={visibleDetail}
        onClose={() => setVisibleDetail(false)}
        width={600}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã thiết bị">{selectedRecord.maThietBi}</Descriptions.Item>
            <Descriptions.Item label="Tên thiết bị">{selectedRecord.tenThietBi}</Descriptions.Item>
            <Descriptions.Item label="Loại thiết bị">{getLoaiThietBiText(selectedRecord.loaiThietBi)}</Descriptions.Item>
            <Descriptions.Item label="Hãng sản xuất">{selectedRecord.hangSanXuat}</Descriptions.Item>
            <Descriptions.Item label="Model">{selectedRecord.model}</Descriptions.Item>
            <Descriptions.Item label="Số lượng tồn kho">{selectedRecord.soLuongTonKho}</Descriptions.Item>
            <Descriptions.Item label="Số lượng đang mượn">{selectedRecord.soLuongDangMuon}</Descriptions.Item>
            <Descriptions.Item label="Đơn giá">{selectedRecord.donGia?.toLocaleString()} VNĐ</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={getTrangThaiColor(selectedRecord.trangThai)}>
                {getTrangThaiText(selectedRecord.trangThai)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">{selectedRecord.viTri}</Descriptions.Item>
            <Descriptions.Item label="Mô tả">{selectedRecord.moTa}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">{selectedRecord.ghiChu}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {moment(selectedRecord.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>

      {/* Form thêm/sửa thiết bị */}
      <ThietBiForm
        visible={visibleForm}
        onCancel={() => setVisibleForm(false)}
        onSubmit={async (values) => {
          if (selectedRecord) {
            await capNhat(selectedRecord._id, values);
          } else {
            await tao(values);
          }
          setVisibleForm(false);
        }}
        record={selectedRecord}
      />

      {/* Modal cập nhật số lượng */}
      <Modal
        title="Cập nhật số lượng tồn kho"
        open={visibleCapNhatSoLuong}
        onOk={handleCapNhatSoLuong}
        onCancel={() => setVisibleCapNhatSoLuong(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Thiết bị:</strong> {selectedRecord?.tenThietBi}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Số lượng hiện tại:</strong> {selectedRecord?.soLuongTonKho}
        </div>
        <div>
          <strong>Số lượng mới:</strong>
          <InputNumber
            min={0}
            value={soLuongMoi}
            onChange={(value) => setSoLuongMoi(value || 0)}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ThietBi;
