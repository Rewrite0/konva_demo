import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // 打包配置
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    lib: {
      entry: 'src/index.js', // 设置入口文件
      name: 'Tooth', // 起个名字，安装、引入用
      fileName: (format) => `Tooth.${format}.js`, // 打包后的文件名
    },
  },
});
