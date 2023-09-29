<script>
	import { goto } from '$app/navigation'
	import { LogIn } from 'svelte-ionicons'
	import { isLogin, keyExpireDate, userProfile, zlibUserId, zlibUserKey } from '../store'
	import { ZLIB_LOGIN_URL, ZLIB_URL } from '$lib/book/consts'

	function handleLogin() {
		let page = window.open(
			'https://singlelogin.se',
			'Authentication',
			'width=550, height=650 left=100 top=50'
		)
		let timer = setInterval(() => {
			console.log(page?.document.URL)
			// clearTimeout(timer)
		}, 1500)
	}
</script>

<div id="nav">
	{#if $isLogin && $userProfile}
		<span>Logined as <b class="highlight">{$userProfile.name}</b></span>
		<div>
			<span
				><b class="highlight"
					>{$userProfile.downloads_today}/{$userProfile.downloads_limit}</b
				> downloaded today</span
			>
		</div>
		<div>
			<a href={`${ZLIB_LOGIN_URL}/logout.php`} target="_blank" class="logout-btn">Logout</a>
		</div>
	{:else}
		<div>
			<a class="login-btn" href={ZLIB_LOGIN_URL} target="_blank">Login</a>
		</div>
	{/if}
</div>

<style lang="scss">
	@import '$lib/variables.scss';

	#nav {
		display: flex;
		justify-content: space-between;
		float: right;
		position: absolute;
		top: 0;
		left: 0;
		padding: 2px 17px;

		background-color: $primary;
		width: 100vw;
		color: white;
	}
	a {
		color: white;
		font-weight: normal;
	}
	.logout-btn {
		margin-left: 5px;
	}
	.highlight {
		color: rgb(246, 161, 57);
	}
</style>
