
import type { ETrangThaiYeuCau, ETrangThaiThietBi, ELoaiThietBi } from './constant';

declare module MuonDo {
  export interface IYeuCauMuon {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    maSinhVien: string;
    tenSinhVien: string;
    email: string;
    soDienThoai?: string;
    lop?: string;
    khoa?: string;
    lyDoMuon: string;
    thoiGianMuonDuKien: string;
    thoiGianTraDuKien: string;
    trangThai: ETrangThaiYeuCau;
    lyDoTuChoi?: string;
    nguoiDuyet?: string;
    thoiGianDuyet?: string;
    danhSachThietBi: IChiTietYeuCau[];
    thoiGianMuonThucTe?: string;
    thoiGianTraThucTe?: string;
    ghiChu?: string;
  }

  export interface IChiTietYeuCau {
    idThietBi: string;
    tenThietBi: string;
    soLuongMuon: number;
    thietBi?: IThietBi;
  }

  export interface IThietBi {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    maThietBi: string;
    tenThietBi: string;
    moTa?: string;
    loaiThietBi: ELoaiThietBi;
    hangSanXuat?: string;
    model?: string;
    soLuongTonKho: number;
    soLuongDangMuon: number;
    donGia?: number;
    trangThai: ETrangThaiThietBi;
    hinhAnh?: string;
    viTri?: string;
    ghiChu?: string;
  }

  export interface ILichSuMuonTra {
    _id: string;
    createdAt?: string;
    idYeuCau: string;
    idThietBi: string;
    maSinhVien: string;
    tenSinhVien: string;
    tenThietBi: string;
    soLuong: number;
    thoiGianMuon: string;
    thoiGianTra?: string;
    trangThai: 'DANG_MUON' | 'DA_TRA';
    nguoiGhiNhan: string;
    ghiChu?: string;
  }
}
