// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import 'unplugin-icons/types/svelte';
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success' | 'redirect';
				text: string;
			};
		}
	}
}

export {};
