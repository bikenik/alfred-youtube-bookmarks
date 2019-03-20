/* eslint no-return-assign: "error" */
/* eslint eqeqeq: ["off"] */

'use strict'
const jsonfile = require('jsonfile')

const db = jsonfile.readFileSync('./src/input/db.json')
const dbFile = './src/input/db.json'

function bookmarksDel(prop) {
	const key = Object.keys(prop)[0]
	const result = db.map(x => {
		x.bookmarks.map((y, i) => {
			if (typeof prop[key] === 'object') {
				if (y[key].filter(x => x == prop[key][0]).length > 0) {
					x.bookmarks.splice(i, 1, null)
				}
			} else if (typeof prop[key] !== 'object') {
				if (y[key] == prop[key]) {
					x.bookmarks.splice(i, 1, null)
				}
			}

			return y
		})

		return x
	}).map(x => {
		x.bookmarks = x.bookmarks.filter(z => {
			return z
		})
		return x
	}).map(x => {
		if (x.bookmarks.length === 0) {
			x = null
		}

		return x
	}).filter(x => x)
	return result
}

function playlist(val) {
	db.map((x, i) => {
		if (x.playlist.title === val) {
			db.splice(i, 1, null)
		}

		return x
	})
	return db.filter(x => x)
}

function writeDb(db) {
	jsonfile.writeFile(dbFile, db, {
		spaces: 2
	}, error => {
		if (error !== null) {
			console.error(error)
		}
	})
}

switch (process.argv[3]) {
	case 'by-tag':
		writeDb(bookmarksDel({tags: JSON.parse(process.env.tags)}))
		break
	case 'by-playlist':
		writeDb(playlist(process.env.playlist))
		break
	case 'by-time':
		writeDb(bookmarksDel({startsAt: process.env.time}))
		break

	default:
		break
}
