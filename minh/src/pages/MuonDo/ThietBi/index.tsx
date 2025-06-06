
import React, { useState } from 'react';
import { Button, Tag, Space, Modal, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import { ETrangThaiThietBi, ELoaiThietBi } from '@/services/MuonDo/constant';
import type { IColumn } from '@/components/Table/typing';
import ThietBiForm from './components/ThietBiForm';

const ThietBi: React.FC = () => {
  const { 
    danhSach, 
    loading, 
    page, 
    limit, 
    total, 
    getData, 
    createModel, 
    updateModel, 
    deleteModel,
    capNhatSoLuongModel 
  } = useModel('muondo.thietbi');

  const [visibleForm, setVisibleForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MuonDo.IThietBi | null>(null);
  const [visibleSoLuong, setVisibleSoLuong] = useState(false);
  const [soLuongMoi, setSoLuongMoi] = useState(0);

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
      default: return trangThai;
    }
  };

  const getLoaiThietBiText = (loai: ELoaiThietBi) => {
    switch (loai) {
      case ELoaiThietBi.DIEN_TU: return 'Điện tử';
      case ELoaiThietBi.VAN_PHONG_PHAM: return 'Văn phòng phẩm';
      case ELoaiThietBi.THE_THAO: return 'Thể thao';
      case ELoaiThietBi.KHAC: return 'Khác';
      default: return loai;
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
      width: 130,
      render: (value: ELoaiThietBi) => getLoaiThietBiText(value),
    },
    {
      title: 'Hãng SX',
      dataIndex: 'hangSanXuat',
      width: 120,
      filterType: 'string',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'soLuongTonKho',
      width: 80,
      align: 'center',
      render: (value: number, record: MuonDo.IThietBi) => (
        <span style={{ color: value <= 5 ? 'red' : 'inherit' }}>
          {value}
        </span>
      ),
    },
    {
      title: 'Đang mượn',
      dataIndex: 'soLuongDangMuon',
      width: 80,
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
      title: 'Vị trí',
      dataIndex: 'viTri',
      width: 120,
      filterType: 'string',
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
            size="small"
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingRecord(record);
              setVisibleForm(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditingRecord(record);
              setSoLuongMoi(record.soLuongTonKho);
              setVisibleSoLuong(true);
            }}
          >
            Cập nhật SL
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc chắn muốn xóa thiết bị "${record.tenThietBi}"?`,
                onOk: () => deleteModel(record._id),
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleCapNhatSoLuong = async () => {
    if (editingRecord) {
      await capNhatSoLuongModel(editingRecord._id, soLuongMoi);
      setVisibleSoLuong(false);
      setEditingRecord(null);
    }
  };

  return (
    <>
      <TableBase
        title="Quản lý thiết bị"
        columns={columns}
        dataSource={danhSach}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total,
        }}
        onChange={(pagination) => {
          getData({ page: pagination.current, limit: pagination.pageSize });
        }}
        buttons={{
          create: true,
          import: true,
          export: true,
        }}
        onCreateClick={() => {
          setEditingRecord(null);
          setVisibleForm(true);
        }}
      />

      {/* Form thêm/sửa thiết bị */}
      <ThietBiForm
        visible={visibleForm}
        onCancel={() => {
          setVisibleForm(false);
          setEditingRecord(null);
        }}
        onSubmit={async (values) => {
          if (editingRecord) {
            await updateModel(editingRecord._id, values);
          } else {
            await createModel(values);
          }
          setVisibleForm(false);
          setEditingRecord(null);
        }}
        record={editingRecord}
      />

      {/* Modal cập nhật số lượng */}
      <Modal
        title="Cập nhật số lượng tồn kho"
        open={visibleSoLuong}
        onOk={handleCapNhatSoLuong}
        onCancel={() => setVisibleSoLuong(false)}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <strong>Thiết bị:</strong> {editingRecord?.tenThietBi}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Số lượng hiện tại:</strong> {editingRecord?.soLuongTonKho}
        </div>
        <div>
          <strong>Số lượng mới:</strong>
          <InputNumber
            value={soLuongMoi}
            onChange={(value) => setSoLuongMoi(value || 0)}
            min={0}
            style={{ marginLeft: 8, width: 120 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default ThietBi;
