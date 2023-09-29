export interface DownloadData {
	downloadLink: string
	description: string
	author: string
	extension: string
	allowDownload: boolean
}

export interface BookResponse {
	success: number
	books: Book[]
	exactBooksCount: number
	pagination: Pagination
}

export interface Pagination {
	limit: number
	current: number
	before: boolean
	next: boolean | number
	total_items: number
	total_pages: number
}

export interface Book {
	id: string
	title: string
	author: string
	volume: string
	year: string
	edition?: null | string
	publisher: string
	identifier: string
	language: string
	extension: string
	pages: string
	filesize: string
	series: string
	cover: string
	terms_hash: string
	active: string
	deleted: number
	filesizeString: string
	href: string
	hash: string
	description: any
	kindleAvailable: boolean
	sendToEmailAvailable: boolean
	interestScore: string
	qualityScore: string
	dl: string
	preview: string
	_isUserSavedBook: boolean
	readOnlineAvailable: boolean
	readOnlineUrl?: boolean | string
}

export interface UserProfile {
	id: number
	email: string
	name: string
	kindle_email: string
	remix_userkey: string
	donations_active: any
	donations_expire: any
	downloads_today: number
	downloads_limit: number
	confirmed: number
	isPremium: number
}
