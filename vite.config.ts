import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
export default defineConfig({
	server: {
		host: true
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
			// experimental
			autoInstall: true
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
