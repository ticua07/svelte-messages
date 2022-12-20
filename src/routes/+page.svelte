<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { sp, type Message } from './lib/stores';
	let unsubscribe = sp.channel('*'); // I don't have supabase's types and i'm too lazy to generate them.
	let messages: Message[] = [];
	sp.from('messages').select('*');

	onMount(async () => {
		sp.from('messages')
			.select('*')
			.order('id', { ascending: false })
			.then((data: NonNullable<{ data: Message[] | null }>) => {
				messages = data.data || [];
			});

		unsubscribe
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages' },
				(payload: { new: Message }) => (messages = [payload.new, ...messages])
			)
			.subscribe();
	});

	onDestroy(async () => {
		// unsubscribe on leave to avoid memory leaks
		unsubscribe.unsubscribe();
	});
</script>

<h1>Welcome to SvelteKit</h1>

{#each messages as message (message.id)}
	<div class="message">
		<h1>{message.title}</h1>
		<p>{message.message}</p>
		<small>{message.id}</small>
	</div>
{/each}

<style>
	.message {
		border: 2px solid black;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	.message > * {
		margin: 0;
	}
</style>
