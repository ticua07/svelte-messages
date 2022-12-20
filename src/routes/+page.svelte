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

	const submitMessage = async (event: any) => {
		const data = new FormData(event.target);

		await sp.from('messages').insert({
			title: data.get('title'),
			message: data.get('message')
		});
	};
</script>

<svelte:head>
	<style>
		body {
			background-color: #121212;
		}
	</style>
</svelte:head>
<div class="container">
	<form class="form" on:submit|preventDefault={submitMessage}>
		<input class="input" type="text" name="title" id="" placeholder="Title" />
		<textarea
			class="input"
			type="text"
			name="message"
			id=""
			rows="5"
			placeholder="Message content"
		/>
		<button class="submit-btn">Submit message</button>
	</form>
	{#each messages as message (message.id)}
		<div class="message">
			<h1>{message.title}</h1>
			<p>{message.message}</p>
		</div>
	{/each}
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@500&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

	.container {
		padding: 50px;
		padding-block: 15px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 20px;
	}
	.container > * {
		color: white;
	}

	.form {
		display: flex;
		flex-direction: column;
		max-width: 550px;
		width: 100%;
		justify-content: center;
		align-items: center;
		gap: 15px;
		background-color: #242424;
		padding: 20px;
		border-radius: 5px;
	}

	.input {
		background-color: #565656;
		color: white;
		border-radius: 5px;
		padding: 5px;
		font-size: 14px;
		font-family: 'Noto Sans';
		border: none;
		outline: none;
		resize: none;
	}

	.submit-btn {
		background-color: #464646;
		color: white;
		border-radius: 5px;
		padding: 8px;
		font-size: 14px;
		font-family: 'Noto Sans';
		border: none;
		outline: none;
		resize: none;
	}

	.form > * {
		width: 100%;
		box-sizing: border-box;
	}
	.message {
		border: 1px solid gray;
		max-width: 550px;
		width: 100%;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		padding: 15px;
	}

	.message > * {
		margin: 0;
	}

	.message > p {
		font-family: 'Noto Sans';
	}

	.message > h1 {
		font-family: 'Fira Sans';
		font-style: normal;
		font-weight: 500;
	}
</style>
