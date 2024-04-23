<script lang="ts">
	import AtSymbolIcon from 'virtual:icons/heroicons/at-symbol';

	import { superForm, defaults } from 'sveltekit-superforms';
	import { zod as SuperFormZod } from 'sveltekit-superforms/adapters';

	import { newUserSchema } from '$lib/utils/sqlite-tables-validators';

	const { form, errors, constraints, message, enhance } = superForm(
		defaults(SuperFormZod(newUserSchema)),
		{
			validators: SuperFormZod(newUserSchema)
		}
	);
	// let files: FileList | null = null;
	// $: if (files) {
	// 	// Note that `files` is of type `FileList`, not an Array:
	// 	// https://developer.mozilla.org/en-US/docs/Web/API/FileList
	// 	console.log(files);
	// 	for (const file of files) {
	// 		console.log(`${file.name}: ${file.size} bytes`);
	// 	}
	// }
	// $: avatarImgPreview = files?.item(0);
</script>

<div class="max-w-screen-xl mx-auto flex flex-col">
	<form use:enhance method="post" action="?/new-user" class="flex flex-col py-10">
		<div>
			<label for="display_name" class="text-sm font-medium leading-6 text-gray-900">
				Display Name
			</label>
			<div class="relative mt-2 rounded-md shadow-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<AtSymbolIcon class="size-5 text-gray-400" aria-hidden="true" />
				</div>
				<input
					type="text"
					name="display_name"
					id="display_name"
					class="w-full rounded-md border-0 py-1.5 pl-9 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
					class:ring-red-500={Array.isArray($errors.display_name) &&
						$errors.display_name.length > 0}
					bind:value={$form.display_name}
					{...$constraints.display_name}
				/>
			</div>
			{#if Array.isArray($errors.display_name)}
				{#each $errors?.display_name as errorMessage}
					<span class="text-red-500"> {errorMessage} </span>
				{/each}
			{/if}
		</div>

		<!-- add avatar image later! -->
		<!-- <div>
      <label for="avatar">Avatar Image</label>
      <input accept="image/*" type="file" id="avatar" bind:files />
      {#if avatarImgPreview != null}
        <img
          id="blah"
          src={URL.createObjectURL(avatarImgPreview)}
          alt="Your avatar"
          class="inline-block size-14 rounded-full object-cover"
        />
      {/if}
    </div> -->
		<button
			type="submit"
			class="rounded-md bg-indigo-600 mt-5 self-end px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Submit
		</button>
	</form>

	{#if $message?.text}
		<p>{$message?.text}</p>
	{/if}
</div>
