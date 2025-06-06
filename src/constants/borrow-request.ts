export const BORROW_REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
} as const;

export type BorrowRequestStatus = typeof BORROW_REQUEST_STATUS[keyof typeof BORROW_REQUEST_STATUS];
