<script lang="ts">
	import UserSignIn from '$lib/components/UserSignIn.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>
<div class="max-w-screen-xl mx-auto flex flex-col">
	<UserSignIn users={data.allUsers} />
</div>
