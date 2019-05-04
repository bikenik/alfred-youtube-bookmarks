/* eslint camelcase: ["error", {properties: "never"}] */

// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License")
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/oauth2.js

'use strict'

require('dotenv').config()
const http = require('http')
const url = require('url')
const opn = require('open')
const {OAuth2Client} = require('google-auth-library')
const destroyer = require('server-destroy')
const alfy = require('alfy')

const ALIVE_TIME = 3000000

/**
 * Start by acquiring a pre-authenticated oAuth2 client.
 * @param {string} id The Google Client ID.
 * @param {string} secret The Google secret.
 * @param {string} callback The 'Callback URL' for callback to redirect - by default it use port:80.
 */
module.exports = async function (id, secret, callback) {
	const oAuth2Client = await getAuthenticatedClient(id, secret, callback)
	// Make a simple request to the People API using our pre-authenticated client. The `request()` method
	// takes an GaxiosOptions object.  Visit https://github.com/JustinBeckwith/gaxios.
	const url = 'https://www.googleapis.com/youtube/v3/'
	const res = await oAuth2Client.request({url})
	console.log(res.data)

	// After acquiring an access_token, you may want to check on the audience, expiration,
	// or original scopes requested.  You can do that with the `getTokenInfo` method.
	const tokenInfo = await oAuth2Client.getTokenInfo(
		oAuth2Client.credentials.access_token
	)
	console.log(tokenInfo)
}

function getAuthenticatedClient(id, secret, callback) {
	return new Promise((resolve, reject) => {
		// Create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
		// Which should be downloaded from the Google Developers Console.
		const oAuth2Client = new OAuth2Client(id, secret, callback)

		// Generate the url that will be used for the consent dialog.
		const authorizeUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: 'https://www.googleapis.com/auth/youtube'
		})

		// Open an http server to accept the oauth callback. In this simple example, the
		// only request to our webserver is to /oauth2callback?code=<code>
		const server = http
			.createServer(async (req, res) => {
				try {
					// Acquire the code from the querystring, and close the web server.
					const qs = new url.URL(req.url, 'http://localhost:80')
						.searchParams
					const code = qs.get('code')
					console.log(`Code is ${code}`)
					res.end('Authentication successful!')
					server.destroy()

					// Now that we have the code, use that to acquire tokens.
					const r = await oAuth2Client.getToken(code)
					// Make sure to set the credentials on the OAuth2 client.
					oAuth2Client.setCredentials(r.tokens)
					alfy.cache.set('access_token', r.tokens.access_token, {maxAge: ALIVE_TIME})
					alfy.cache.set('refresh_token', r.tokens.refresh_token)
					resolve(oAuth2Client)
				} catch (error) {
					reject(error)
				}
			})
			.listen(80, async () => {
				// Open the browser to the authorize url to start the workflow
				await opn(authorizeUrl, {wait: false})(cp => cp.unref())
				// Opn(authorizeUrl, {wait: false}).then(cp => cp.unref())
			})
		destroyer(server)
	})
}
