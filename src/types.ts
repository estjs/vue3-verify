/**
 * 类型定义
 */

import type { Ref } from 'vue';
import type { VerifyStatus as VerifyStatusType, VerifyType as VerifyTypeEnum } from './constants';

// Re-export for external use
export type VerifyType = VerifyTypeEnum;
export type VerifyStatus = VerifyStatusType;

export * from './constants';

// Size and configuration types
export interface SizeConfig {
  width?: string | number;
  height?: string | number;
}

export interface BarSize {
  width?: string;
  height?: string;
}

export interface BlockSize {
  width?: string;
  height?: string;
}

// 基础 Props
export interface VerifyProps {
  refreshIcon?: string;
  theme?: Record<string, any>;
  showRefresh?: boolean;
}

/**
 * Canvas 操作选项
 */
export interface CanvasOptions {
  /** Canvas 元素引用 */
  canvasRef: Ref<HTMLCanvasElement | undefined>;
  /** 上下文类型 */
  contextType?: '2d' | 'webgl' | 'webgl2';
}

/**
 * 绘制图片选项
 */
export interface DrawImageOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  sourceX?: number;
  sourceY?: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

/**
 * 绘制文本选项
 */
export interface DrawTextOptions {
  text: string;
  x: number;
  y: number;
  font?: string;
  fillStyle?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
}

/**
 * 绘制矩形选项
 */
export interface DrawRectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

/**
 * 绘制圆形选项
 */
export interface DrawCircleOptions {
  x: number;
  y: number;
  radius: number;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

/**
 * 滑块验证配置
 */
export interface SlideVerificationConfig {
  /** 图片尺寸 */
  imgSize: SizeConfig;
  /** 滑块尺寸 */
  blockSize: SizeConfig;
  /** 滑动条尺寸 */
  barSize: SizeConfig;
  /** 垂直偏移 */
  vOffset?: number;
  /** 误差范围 */
  tolerance?: number;
}

/**
 * 点选验证配置
 */
export interface PointsVerificationConfig {
  /** 图片尺寸 */
  imgSize: SizeConfig;
  /** 点选数量 */
  checkNum: number;
  /** 误差范围 */
  tolerance?: number;
}

/**
 * 验证结果
 */
export interface VerificationResult {
  /** 是否成功 */
  success: boolean;
  /** 耗时 */
  duration: number;
  /** 额外数据 */
  data?: any;
}

/**
 * 拖拽状态
 */
export interface DragState {
  /** 是否正在拖拽 */
  isDragging: Ref<boolean>;
  /** 起始位置 */
  startX: Ref<number>;
  /** 当前位置 */
  currentX: Ref<number>;
  /** 移动距离 */
  deltaX: Ref<number>;
}

/**
 * 验证状态
 */
export interface VerifyState {
  /** 当前状态 */
  status: Ref<VerifyStatus>;
  /** 是否加载中 */
  loading: Ref<boolean>;
  /** 错误信息 */
  error: Ref<string | null>;
}

/**
 * 验证成功事件数据
 */
export interface VerifySuccessData {
  /** 验证类型 */
  type: VerifyType;
  /** 耗时（毫秒） */
  duration: number;
  /** 验证值 */
  value?: any;
  /** 是否完全结束 */
  isEnd?: boolean;
}

/**
 * 验证失败事件数据
 */
export interface VerifyErrorData {
  /** 验证类型 */
  type: VerifyType;
  /** 错误信息 */
  message: string;
  /** 错误代码 */
  code?: string;
}

/**
 * 验证就绪事件数据
 */
export interface VerifyReadyData {
  /** 验证类型 */
  type: VerifyType;
  /** 是否已加载 */
  loaded: boolean;
}

/**
 * 拖拽事件数据
 */
export interface DragEventData {
  /** 起始 X 坐标 */
  startX: number;
  /** 当前 X 坐标 */
  currentX: number;
  /** 移动距离 */
  deltaX: number;
}

/**
 * 点击事件数据
 */
export interface ClickEventData {
  /** X 坐标 */
  x: number;
  /** Y 坐标 */
  y: number;
  /** 点击索引 */
  index: number;
}
