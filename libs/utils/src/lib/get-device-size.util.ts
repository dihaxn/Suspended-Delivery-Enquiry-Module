export const DEVICE_SIZE = {
  SMALL_MOBILE: 'small-mobile',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
  LARGE_DESKTOP: 'large-desktop',
  LARGER_DESKTOP: 'larger-desktop',
} as const;

export type DEVICE_SIZE = (typeof DEVICE_SIZE)[keyof typeof DEVICE_SIZE];

export const getDeviceSize = (width: number): DEVICE_SIZE => {
  if (width < 576) {
    return DEVICE_SIZE.SMALL_MOBILE;
  } else if (width < 768) {
    return DEVICE_SIZE.MOBILE;
  } else if (width < 992) {
    return DEVICE_SIZE.TABLET;
  } else if (width < 1200) {
    return DEVICE_SIZE.DESKTOP;
  } else if (width < 1440) {
    return DEVICE_SIZE.LARGE_DESKTOP;
  } else {
    return DEVICE_SIZE.LARGER_DESKTOP;
  }
};
