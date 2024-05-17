import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: node({
		mode: 'standalone'
	}),
	experimental: {
		actions: true
	},
	integrations: [svelte(), tailwind(), react()],
	vite: {
		ssr: {
			noExternal: ['svelte-sonner']
		}
	}
});
