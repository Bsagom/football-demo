import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/football-demo/',
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // .env 파일의 API 키를 헤더에 추가
              proxyReq.setHeader('X-Auth-Token', env.VITE_FOOTBALL_API_KEY || '');
              console.log('🔑 Proxy API Key:', env.VITE_FOOTBALL_API_KEY ? 'Configured' : 'MISSING');
            });
          },
        },
      },
    },
  }
})
