<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { sp, messages } from './lib/stores';
	let unsubscribe = sp.channel('*'); // I don't have supabase's types and i'm too lazy to generate them.
	sp.from('messages').select('*');

	onMount(async () => {
		unsubscribe
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) =>
				console.log(payload)
			)
			.subscribe();
	});

	onDestroy(async () => {
		// unsubscribe on leave to avoid memory leaks
		unsubscribe.unsubscribe();
	});
</script>

<h1>Welcome to SvelteKit</h1>
