export type ThietBi = {
  _id: string;
  tenThietBi: string;
  loaiThietBi: string;
  soLuongTong: number;
  soLuongDaChoMuon: number;
  soLuongConLai: number;
  tinhTrang: 'Sẵn sàng' | 'Hết hàng' | 'Bảo trì';
  moTa: string;
  hinhAnh?: string;
  ngayTao: string;
};