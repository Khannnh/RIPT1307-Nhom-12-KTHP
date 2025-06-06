import { Device } from './device';
import { User } from './user';

export interface BorrowRequest {
  _id: string;
  userId: string;
  deviceId: string;
  borrowDate: string;
  returnDate: string;
  status: string;
  note: string;
  user?: User;
  device?: Device;
  createdAt: string;
  updatedAt: string;
}
