import { derived, writable, type Writable } from 'svelte/store'
import { dev } from '$app/environment'
import axios from 'axios'
import { get } from 'svelte/store'
import type { Book, BookResponse, DownloadData, UserProfile } from './types'
import booksDataRequest from './booksDataRequest.json'
import { ZLIB_LOGIN_URL, ZLIB_URL } from './consts'

export let zlibUserId = writable('')
export let zlibUserKey = writable('')
export let keyExpireDate = writable(Date.now() - 1)
export let userProfile: Writable<UserProfile> = writable()

export const bookResponse: Writable<BookResponse> = writable({
	success: 0,
	exactBooksCount: 0,
	books: [],
	pagination: {
		limit: 20,
		current: 0,
		before: false,
		next: 1,
		total_items: 0,
		total_pages: 0,
	},
})
export const searchTitle = writable('')
export const searched = writable(false)
export const isLogin = derived(
	[zlibUserId, zlibUserKey, keyExpireDate],
	([$zlibUserId, $zlibUserKey, $keyExpireDate]) => {
		return $keyExpireDate >= Date.now() && $zlibUserId !== '' && $zlibUserKey !== ''
	}
)

export async function loadBooks() {
	const state = (await chrome.storage.session.get(['state'])).state

	if (state?.bookResponse?.success === 1) {
		bookResponse.set(state?.bookResponse || get(bookResponse))
		searchTitle.set(state?.searchTitle || get(searchTitle))
		searched.set(state?.searched || get(searched))
		console.log('loaded')
	}

	console.log(state)
}

export async function fetchBooks(isAppend: boolean = true) {
	const value = get(bookResponse)

	if (dev) {
		value.books = booksDataRequest.books
		value.pagination = booksDataRequest.pagination
		value.exactBooksCount = booksDataRequest.exactBooksCount
	} else {
		const formData = new FormData()
		formData.set('message', get(searchTitle))
		formData.set('limit', value.pagination.limit.toString())
		formData.set('page', isAppend ? value.pagination.next.toString() : '1')
		const res = await axios.post(`${ZLIB_URL}/eapi/book/search`, formData)

		const resData: BookResponse = res.data

		value.success = resData.success
		value.exactBooksCount = resData.exactBooksCount
		value.pagination = resData.pagination

		if (isAppend) {
			value.books = [...value.books, ...resData.books]
		} else {
			value.books = resData.books
			chrome.storage.session.set({
				state: {
					bookResponse: value,
					searchTitle: get(searchTitle),
					searched: true,
				},
			})
		}
	}
	bookResponse.set(value)
}

export async function downloadBook(book: Book) {
	const res = await axios.get(`${ZLIB_URL}/eapi/book/${book.id}/${book.hash}/file`, {
		headers: {
			'remix-userid': get(zlibUserId),
			'remix-userkey': get(zlibUserKey),
		},
	})
	const downloadData: DownloadData = res.data.file

	chrome.downloads.download({ url: downloadData.downloadLink })
}

export function login() {
	chrome.cookies.get({ url: ZLIB_LOGIN_URL, name: 'remix_userid' }, (cookie1) => {
		chrome.cookies.get({ url: ZLIB_LOGIN_URL, name: 'remix_userkey' }, async (cookie2) => {
			zlibUserId.set(cookie1?.value || '')
			zlibUserKey.set(cookie2?.value || '')
			keyExpireDate.set((cookie2?.expirationDate || 0) * 1000)

			if (get(isLogin)) {
				const res = await axios.get(`${ZLIB_URL}/eapi/user/profile`, {
					headers: {
						'remix-userid': get(zlibUserId),
						'remix-userkey': get(zlibUserKey),
					},
				})
				if (res.data?.user) userProfile.set(res.data.user)
			}
		})
	})
}
