<script lang="ts">
	let searchInput =
		"I'm testing a REST API to ask you questions. Respond with some facts about the Sonoran Desert.";
</script>

<form class="max-w-screen-lg mx-auto my-40">
	<div>
		<label for="convo-name" class="block text-sm font-medium leading-6 text-gray-900"
			>New Convo</label
		>
		<div class="mt-2">
			<input
				type="text"
				name="convo-name"
				id="convo-name"
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				bind:value={searchInput}
			/>
		</div>
	</div>
	<button type="submit">Submit</button>
</form>

