export interface ThietBi {
  id: string;
  ten: string;
  moTa: string;
  hinhAnh: string;
  soLuong: number;
  soLuongConLai: number;
  trangThai: 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE' | 'DAMAGED';
  danhMuc: string;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface ThietBiParams {
  current?: number;
  pageSize?: number;
  ten?: string;
  danhMuc?: string;
  trangThai?: string;
}

export interface ThietBiForm {
  ten: string;
  moTa: string;
  hinhAnh: string;
  soLuong: number;
  danhMuc: string;
}

export interface DanhMucThietBi {
  id: string;
  ten: string;
  moTa: string;
}