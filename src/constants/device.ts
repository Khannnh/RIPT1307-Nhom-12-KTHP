export const DEVICE_STATUS = {
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance',
  LOST: 'lost'
} as const;

export type DeviceStatus = typeof DEVICE_STATUS[keyof typeof DEVICE_STATUS];
