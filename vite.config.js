import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		global: 'window', // Thêm alias cho global để sử dụng window thay thế
	},
});
