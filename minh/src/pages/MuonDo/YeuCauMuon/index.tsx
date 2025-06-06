
import React, { useState } from 'react';
import { Button, Tag, Space, Drawer, Descriptions, Table, Modal } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import TableBase from '@/components/Table';
import { useModel } from 'umi';
import moment from 'moment';
import { ETrangThaiYeuCau } from '@/services/MuonDo/constant';
import type { IColumn } from '@/components/Table/typing';
import DuyetYeuCauForm from './components/DuyetYeuCauForm';
import GhiNhanMuonTraForm from './components/GhiNhanMuonTraForm';

const YeuCauMuon: React.FC = () => {
  const { danhSach, loading, page, limit, total, getData, duyetYeuCauModel, ghiNhanMuonModel, ghiNhanTraModel } = useModel('muondo.yeucaumuon');
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MuonDo.IYeuCauMuon | null>(null);
  const [visibleDuyet, setVisibleDuyet] = useState(false);
  const [visibleGhiNhan, setVisibleGhiNhan] = useState(false);
  const [loaiGhiNhan, setLoaiGhiNhan] = useState<'MUON' | 'TRA'>('MUON');

  const getTrangThaiColor = (trangThai: ETrangThaiYeuCau) => {
    switch (trangThai) {
      case ETrangThaiYeuCau.CHO_DUYET: return 'processing';
      case ETrangThaiYeuCau.DA_DUYET: return 'success';
      case ETrangThaiYeuCau.TU_CHOI: return 'error';
      case ETrangThaiYeuCau.DA_MUON: return 'warning';
      case ETrangThaiYeuCau.DA_TRA: return 'default';
      default: return 'default';
    }
  };

  const getTrangThaiText = (trangThai: ETrangThaiYeuCau) => {
    switch (trangThai) {
      case ETrangThaiYeuCau.CHO_DUYET: return 'Chờ duyệt';
      case ETrangThaiYeuCau.DA_DUYET: return 'Đã duyệt';
      case ETrangThaiYeuCau.TU_CHOI: return 'Từ chối';
      case ETrangThaiYeuCau.DA_MUON: return 'Đã mượn';
      case ETrangThaiYeuCau.DA_TRA: return 'Đã trả';
      default: return 'Không xác định';
    }
  };

  const columns: IColumn<MuonDo.IYeuCauMuon>[] = [
    {
      title: 'Mã SV',
      dataIndex: 'maSinhVien',
      width: 100,
      filterType: 'string',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'tenSinhVien',
      width: 150,
      filterType: 'string',
    },
    {
      title: 'Lớp',
      dataIndex: 'lop',
      width: 100,
      filterType: 'string',
    },
    {
      title: 'Lý do mượn',
      dataIndex: 'lyDoMuon',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 120,
      align: 'center',
      render: (value: ETrangThaiYeuCau) => (
        <Tag color={getTrangThaiColor(value)}>{getTrangThaiText(value)}</Tag>
      ),
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      width: 120,
      align: 'center',
      render: (value: string) => moment(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 200,
      fixed: 'right',
      render: (record: MuonDo.IYeuCauMuon) => (
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
          {record.trangThai === ETrangThaiYeuCau.CHO_DUYET && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                setVisibleDuyet(true);
              }}
            >
              Duyệt
            </Button>
          )}
          {record.trangThai === ETrangThaiYeuCau.DA_DUYET && (
            <Button
              type="link"
              style={{ color: '#52c41a' }}
              onClick={() => {
                setSelectedRecord(record);
                setLoaiGhiNhan('MUON');
                setVisibleGhiNhan(true);
              }}
            >
              Ghi nhận mượn
            </Button>
          )}
          {record.trangThai === ETrangThaiYeuCau.DA_MUON && (
            <Button
              type="link"
              style={{ color: '#1890ff' }}
              onClick={() => {
                setSelectedRecord(record);
                setLoaiGhiNhan('TRA');
                setVisibleGhiNhan(true);
              }}
            >
              Ghi nhận trả
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const chiTietThietBiColumns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      key: 'tenThietBi',
    },
    {
      title: 'Số lượng mượn',
      dataIndex: 'soLuongMuon',
      key: 'soLuongMuon',
      align: 'center' as const,
    },
  ];

  return (
    <div>
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
        scroll={{ x: 800 }}
        rowKey="_id"
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết yêu cầu mượn"
        open={visibleDetail}
        onClose={() => setVisibleDetail(false)}
        width={600}
      >
        {selectedRecord && (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã sinh viên">{selectedRecord.maSinhVien}</Descriptions.Item>
              <Descriptions.Item label="Tên sinh viên">{selectedRecord.tenSinhVien}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedRecord.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{selectedRecord.soDienThoai}</Descriptions.Item>
              <Descriptions.Item label="Lớp">{selectedRecord.lop}</Descriptions.Item>
              <Descriptions.Item label="Khoa">{selectedRecord.khoa}</Descriptions.Item>
              <Descriptions.Item label="Lý do mượn">{selectedRecord.lyDoMuon}</Descriptions.Item>
              <Descriptions.Item label="Thời gian mượn dự kiến">
                {moment(selectedRecord.thoiGianMuonDuKien).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian trả dự kiến">
                {moment(selectedRecord.thoiGianTraDuKien).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getTrangThaiColor(selectedRecord.trangThai)}>
                  {getTrangThaiText(selectedRecord.trangThai)}
                </Tag>
              </Descriptions.Item>
              {selectedRecord.lyDoTuChoi && (
                <Descriptions.Item label="Lý do từ chối">{selectedRecord.lyDoTuChoi}</Descriptions.Item>
              )}
            </Descriptions>

            <div>
              <h3>Danh sách thiết bị mượn:</h3>
              <Table
                columns={chiTietThietBiColumns}
                dataSource={selectedRecord.danhSachThietBi}
                pagination={false}
                size="small"
                rowKey="idThietBi"
              />
            </div>
          </Space>
        )}
      </Drawer>

      {/* Form duyệt yêu cầu */}
      {visibleDuyet && selectedRecord && (
        <DuyetYeuCauForm
          visible={visibleDuyet}
          onCancel={() => setVisibleDuyet(false)}
          onSubmit={async (values) => {
            await duyetYeuCauModel(selectedRecord._id, values);
            setVisibleDuyet(false);
          }}
          record={selectedRecord}
        />
      )}

      {/* Form ghi nhận mượn/trả */}
      {visibleGhiNhan && selectedRecord && (
        <GhiNhanMuonTraForm
          visible={visibleGhiNhan}
          onCancel={() => setVisibleGhiNhan(false)}
          onSubmit={async (values) => {
            if (loaiGhiNhan === 'MUON') {
              await ghiNhanMuonModel(selectedRecord._id, values);
            } else {
              await ghiNhanTraModel(selectedRecord._id, values);
            }
            setVisibleGhiNhan(false);
          }}
          record={selectedRecord}
          loai={loaiGhiNhan}
        />
      )}
    </div>
  );
};

export default YeuCauMuon;
