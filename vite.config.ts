import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/local",
	plugins: [react()],
	build: {
		sourcemap: "inline",
		minify: false,
		rollupOptions: {
			input: resolve(__dirname, "src/main.tsx"),
			output: {
				entryFileNames: `ha-draw.js`,
				chunkFileNames: `[name].js`,
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'main.css') {
						return 'ha-draw.css';
					}
					return assetInfo.name;
				},
			},
		},
	},
});
