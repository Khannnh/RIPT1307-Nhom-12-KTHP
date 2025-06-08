export type YeuCau = {
  _id: string;
  nguoiMuon: {
    ten: string;
    id: string;
  };
  thietBi: {
    ten: string;
    id: string;
  };
  soLuong: number;
  ngayYeuCau: string;
  ngayHenTra: string;
  lyDo: string;
  trangThai: 'Chờ duyệt' | 'Đã duyệt' | 'Đã từ chối' | 'Đã lấy' | 'Đã trả';
};