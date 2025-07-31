import { createConsola } from 'consola';

// 创建 consola 实例
export const logger = createConsola({
  // 可以自定义主题
  formatOptions: {
    date: false,
    colors: true,
    compact: true,
  },
});
