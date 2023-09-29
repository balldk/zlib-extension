<script lang="ts">
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import { Book as BookIcon } from 'svelte-ionicons'

	import {
		bookResponse,
		searchTitle,
		searched,
		fetchBooks,
		loadBooks,
		login,
	} from '$lib/book/store'
	import BookList from '$lib/book/components/BookList.svelte'
	import Nav from '$lib/book/components/Nav.svelte'

	let bookTitle = ''
	let fetching = false

	async function handleSearch() {
		if (bookTitle === '') {
			return
		}

		searchTitle.set(bookTitle)

		await fetchBooks(false)
		searched.set(true)
		bookTitle = ''
	}

	onMount(async () => {
		setTimeout(() => {
			window.onscroll = async () => {
				if (
					!fetching &&
					$bookResponse.pagination.next &&
					window.innerHeight + window.scrollY >= document.body.scrollHeight - 100
				) {
					fetching = true
					await fetchBooks()

					setTimeout(() => {
						fetching = false
					}, 500)
				}
			}
		}, 1000)
		loadBooks()
		login()
	})
</script>

<div class="wrapper">
	<Nav />
	<h1><BookIcon /> ZLibrary Searcher</h1>
	<form class="search-form">
		<!-- svelte-ignore a11y-autofocus -->
		<input bind:value={bookTitle} type="text" placeholder="Book title" autofocus />
		<input on:click|preventDefault={handleSearch} type="submit" value="Search" />
	</form>
	{#if $searched}
		<p class="search-found-txt" in:fade>
			<span class="red">{$bookResponse.pagination.total_items}</span> results found for "<span
				class="red">{$searchTitle}</span
			>"
		</p>
	{/if}
	<BookList />
	{#if $searched}
		<div class="bottom-space" />
	{/if}
</div>

<style lang="scss">
	@import '$lib/variables.scss';

	:global(.control svg) {
		transform: translate(0px, 8px) scale(0.7);
	}
	:global(.wrapper h1 svg) {
		transform: translate(0, 4px);
		color: $primary;
	}

	.red {
		color: $primary;
	}
	.wrapper {
		width: fit-content;
		margin: 10px;
		margin-top: 30px;
	}
	.search-form {
		width: 400px;
		margin-bottom: 20px;
	}
	.search-found-txt {
		width: 550px;
	}
	.bottom-space {
		height: 100px;
		width: 1px;
	}
	input[type='text'] {
		width: 260px;
	}
</style>
