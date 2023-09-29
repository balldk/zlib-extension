<script>
	import '$lib/variables.scss'
</script>

<slot />

<style global lang="scss">
	@import '$lib/variables.scss';
	@import url('https://fonts.googleapis.com/css2?family=Short+Stack&display=swap');

	body {
		font-family: 'Short Stack', cursive;
		font-size: 13px;
	}
	button,
	input[type='submit'] {
		cursor: pointer;
	}
	input {
		display: inline-block;
		outline: none;
		padding: 1px 2px;
	}

	::-webkit-scrollbar {
		width: 5px;
	}
	::-webkit-scrollbar-thumb {
		background: brown;
		border-radius: 4px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
</style>
