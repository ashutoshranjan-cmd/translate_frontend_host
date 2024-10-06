import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      "/api":{
        // target: 'http://localhost:4000',
        target: 'https://translate-backend-host-git-master-ashutoshranjan-cmds-projects.vercel.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      "/pay":{
        target: 'https://translate-backend-host-git-master-ashutoshranjan-cmds-projects.vercel.app/',
        // target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pay/, ''),
      }
    }
  }
})
