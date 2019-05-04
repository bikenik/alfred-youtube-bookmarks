/* eslint no-useless-concat: "off" */
/* eslint camelcase: ["error", {properties: "never"}] */
/* eslint camelcase: ["error", {allow: ["^client_","access_token","grant_type","refresh_token"]}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */

'use strict'
require('dotenv').config()
const alfy = require('alfy')
const jsonfile = require('jsonfile')

const getAuthenticatedClient = require('./src/authenticate')
const WorkflowError = require('./src/utils/errors')
const services = require('./src/youtube/services')
const settings = require('./src/settings')
const {tags, addBookmark, playlist} = require('./src/bookmarks/add-bookmark')

const db = `${process.env.alfred_workflow_data}/db.json`
const currentDB = require(db)

const googleId = process.env.GOOGLE_CLIENT_ID || alfy.config.get('GOOGLE_CLIENT_ID')
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || alfy.config.get('GOOGLE_CLIENT_SECRET')
const googleRedirectCallback = 'http://localhost'

const ALIVE_TIME = 3000000

const fetchOptions = (token, query = '') => ({
	headers: {
		Authorization: `Bearer ${token}`
	},
	method: 'GET',
	query
})

const refreshTokenOptions = () => {
	return {
		json: true,
		method: 'POST',
		body: {
			client_id: googleId,
			client_secret: googleSecret,
			refresh_token: alfy.cache.get('refresh_token'),
			grant_type: 'refresh_token'
		}
	}
}

const fetch = async (url, token, action, map) => {
	const render = data => {
		const items = data.map(data => map(data))
		alfy.output(alfy.inputMatches(items, 'title'))
	}

	try {
		let _dataFetching
		/* eslint-disable no-await-in-loop */
		do {
			const currentItems = _dataFetching ? _dataFetching.items : null
			if (_dataFetching && _dataFetching.nextPageToken) {
				action.pageToken = _dataFetching.nextPageToken
			}

			_dataFetching = await alfy.fetch(url, fetchOptions(token, action))
			const currentToken = _dataFetching.nextPageToken
			if (currentItems) {
				const tmp = currentItems.concat(_dataFetching.items)
				_dataFetching.items = tmp
				_dataFetching.nextPageToken = currentToken
			}
		} while (_dataFetching.nextPageToken)
		/* eslint-enable no-await-in-loop */

		_dataFetching = render(_dataFetching.items)
	} catch (error) {
		if (error && error.stack) {
			throw new WorkflowError(error.stack)
		}
	}
}

const main = async (url, action, map) => {
	const setIt = settings(alfy.input)
	if (setIt === 'adjusted') {
		if (alfy.cache.has('access_token')) {
			const token = alfy.cache.get('access_token')
			fetch(url, token, action, map)
		} else {
			const refresh = ({access_token}) => {
				alfy.cache.set('access_token', access_token, {maxAge: ALIVE_TIME})
				const token = alfy.cache.get('access_token')
				fetch(url, token, action, map)
			}

			try {
				try {
					let _refreshToken = await alfy.fetch('https://www.googleapis.com/oauth2/v4/token', refreshTokenOptions())
					_refreshToken = refresh(_refreshToken)
				} catch {
					getAuthenticatedClient(googleId, googleSecret, googleRedirectCallback)
				}
			} catch (error) {
				throw new WorkflowError(error)
			}
		}
	}
}

switch (process.argv[3]) {
	case 'playlist':
		main(services.playlist.url, services.playlist.query, services.playlist.map)
		break
	case 'playlistItems':
		main(services.playlistItems.url, services.playlistItems.query, services.playlistItems.map)
		break
	case 'channel':
		main(services.channel.url, services.channel.query, services.channel.map)
		break
	case 'activities':
		main(services.activities.url, services.activities.query, services.activities.map)
		break
	case 'add-bookmarks':
		addBookmark(currentDB)
		break
	case 'show-tags':
		tags(currentDB)
		break
	case 'show-playlists':
		playlist(currentDB)
		break
	case 'add-tags':
		addBookmark(currentDB, process.argv[2])
		break
	case 'bookmark-update':
		jsonfile.writeFile(db, JSON.parse(process.argv[2]), {
			spaces: 2
		}, error => {
			if (error !== null) {
				console.error(error)
			}
		})
		break
	case 'reset':
		settings('!')
		break

	default:
		break
}
