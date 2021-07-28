import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_ASSET_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')//设置别名
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            $color-primary: #E86487;
          `,
        }
      }
    },
    plugins: [vue()],
  }
})
