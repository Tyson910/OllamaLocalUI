<script>
	import '$lib/styles/global.css';
	import { Toaster } from 'svelte-sonner';
</script>

<slot />
<Toaster richColors closeButton duration={10_000}  />
