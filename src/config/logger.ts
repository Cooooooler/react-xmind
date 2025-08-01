import { createConsola } from 'consola';

// 创建 consola 实例
export const logger = createConsola({
  // 自定义主题和格式化选项
  formatOptions: {
    date: true,
    colors: true,
    compact: false,
  },
  // 设置日志级别
  level: process.env.NODE_ENV === 'production' ? 3 : 4, // 生产环境只显示warn和error
});

// 添加自定义日志方法
export const logUserAction = (action: string, data?: any) => {
  logger.info(`[用户操作] ${action}`, data);
};

export const logApiError = (api: string, error: any) => {
  logger.error(`[API错误] ${api}:`, error);
};

export const logApiSuccess = (api: string, data?: any) => {
  logger.success(`[API成功] ${api}`, data);
};
