<script lang="ts">
	import { slide } from 'svelte/transition'
	import { bookResponse, downloadBook, isLogin } from '../store'
	import { ArrowDown, Link } from 'svelte-ionicons'
	import type { Book } from '../types'
	import { keyExpireDate, userProfile, zlibUserId, zlibUserKey } from '../store'

	function bookDownloadDisplay(book: Book) {
		let mb = (parseInt(book.filesize) / 1_000_000).toFixed(1)
		return `${book.extension}, ${mb} Mb`
	}
</script>

{#each $bookResponse.books as book, index (book.id)}
	<div
		class="book-container"
		in:slide={{ delay: (index % $bookResponse.pagination.limit) * 150 }}
	>
		<div class="cover">
			<img src={book.cover} alt={book.title} />
		</div>
		<div class="content">
			<p class="title">{book.title}</p>
			{#if book.publisher}
				<p class="publisher">{book.publisher}</p>
			{/if}
			<p class="author">{book.author}</p>
			{#if book.pages !== '0'}
				<p>Pages: {book.pages}</p>
			{/if}
			<div class="control">
				{#if typeof book.readOnlineUrl === 'string'}
					<a target="_blank" href={book.readOnlineUrl}><Link />Read online</a>
				{/if}
				<a
					href="/"
					class={'download-btn ' + ($isLogin ? '' : 'disabled tooltip')}
					data-popup="You must login to download"
					on:click|preventDefault={() => downloadBook(book)}
				>
					<ArrowDown />{bookDownloadDisplay(book)}</a
				>
			</div>
		</div>
	</div>
{/each}

<style lang="scss">
	@import '$lib/variables.scss';

	.book-container {
		position: relative;
		width: 550px;
		margin: 10px 0;
		padding: 10px 0;
		height: fit-content;

		border-style: solid;
		border-width: 7px;
		border-image: url(doodle.css/button.svg) 7 7 7 7 stretch stretch;

		display: flex;
		gap: 10px;

		.control {
			position: absolute;
			right: 10px;
			bottom: 10px;
		}
		a {
			margin-right: 10px;
			&:hover {
				color: $primary;
			}
		}

		p {
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.cover {
			flex: 0 0 150px;
			min-width: 150px;
			img {
				display: block;
				margin: 0 auto;
				height: 150px;
				min-width: 80px;
			}
		}
		.title {
			margin: 0;
			font-size: 1rem;
			overflow: hidden;
			text-overflow: ellipsis;
			font-weight: bold;
		}
		.publisher {
			color: gray;
			margin-top: 10px;
		}
		.author {
			color: $primary;
		}
	}
	.disabled {
		color: gray;
		cursor: default;

		&:hover {
			color: gray !important;
		}
	}
	.tooltip {
		position: relative;

		&::after {
			content: attr(data-popup);
			color: black;
			visibility: hidden;
			opacity: 0;
			position: absolute;
			top: -45px;
			left: -5px;
			z-index: 1;

			display: inline-block;
			width: 120px;
			text-align: center;
			font-size: 0.7rem;

			border-style: solid;
			border-width: 4px;
			border-image: url(doodle.css/button.svg) 7 7 7 7 stretch stretch;
			background-color: rgb(246, 161, 57);
			transform: translateY(5px);

			transition: 0.2s all;
		}
		&:hover {
			&::after {
				visibility: visible;
				opacity: 1;
				transform: translateY(0px);
			}
		}
	}
</style>
