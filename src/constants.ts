/**
 * 验证类型常量
 */
export const VERIFY_TYPES = {
  /** 图片验证码 */
  PICTURE: 'picture',
  /** 计算验证码 */
  COMPUTE: 'compute',
  /** 滑动验证 */
  SLIDE: 'slide',
  /** 拼图验证 */
  PUZZLE: 'puzzle',
  /** 点选验证 */
  PICK: 'pick',
} as const;

export type VerifyType = (typeof VERIFY_TYPES)[keyof typeof VERIFY_TYPES];

/**
 * 验证状态常量
 */
export const VERIFY_STATUS = {
  /** 初始状态 */
  IDLE: 'idle',
  /** 验证中 */
  VERIFYING: 'verifying',
  /** 验证成功 */
  SUCCESS: 'success',
  /** 验证失败 */
  ERROR: 'error',
  /** 加载中 */
  LOADING: 'loading',
} as const;

export type VerifyStatus = (typeof VERIFY_STATUS)[keyof typeof VERIFY_STATUS];

/**
 * 默认配置常量
 */
export const DEFAULT_CONFIG = {
  /** 默认图片宽度 */
  IMG_WIDTH: 310,
  /** 默认图片高度 */
  IMG_HEIGHT: 155,
  /** 默认滑块宽度 */
  BLOCK_WIDTH: 50,
  /** 默认滑块高度 */
  BLOCK_HEIGHT: 50,
  /** 默认滑动条宽度 */
  BAR_WIDTH: 310,
  /** 默认滑动条高度 */
  BAR_HEIGHT: 40,
  /** 默认验证码长度 */
  CODE_LENGTH: 4,
  /** 默认点选数量 */
  POINTS_COUNT: 3,
  /** 验证误差范围 */
  TOLERANCE: 5,
} as const;

/**
 * 验证码字符集
 */
export const CODE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * 默认颜色配置
 */
export const DEFAULT_COLORS = {
  primary: '#409eff',
  success: '#67c23a',
  error: '#f56c6c',
  warning: '#e6a23c',
  info: '#909399',
} as const;
