'use strict'

const alfy = require('alfy')

const helpUrl = 'https://medium.com/@pablo127/google-api-authentication-with-oauth-2-on-the-example-of-gmail-a103c897fd98'

module.exports = input => {
	if (alfy.config.get('id') === undefined) {
		const subtitle = 'Hit ↵ to set your ID | hit ⌥+↵ to read "how to create client Id" in medium.com'
		alfy.output([{
			title: `Your google CLIENT ID is: "${input}"`,
			subtitle,
			icon: {path: './icons/Settings.png'},
			variables: {
				settingMode: 'id'
			},
			arg: input,
			text: {largetype: subtitle}
		},
		{
			title: 'Google API authentication',
			subtitle: 'open in browser medium.com to read article',
			icon: {path: './icons/Settings.png'},
			variables: {
				mode: 'service'
			},
			arg: helpUrl
		}])
	} else if (alfy.config.get('secret') === undefined) {
		const subtitle = 'Hit ↵ to set your SECRET | hit ⌥+↵ to read "how to create client Id" in medium.com'
		alfy.output([{
			title: `Your google SECRET ID is: "${input}"`,
			subtitle,
			icon: {path: './icons/Settings.png'},
			variables: {
				settingMode: 'secret'
			},
			text: {largetype: subtitle},
			arg: input,
			mods: {
				alt: {
					subtitle: 'open in browser medium.com to get instruction',
					arg: helpUrl
				}
			}
		},
		{
			title: 'Google API authentication',
			subtitle: 'open in browser medium.com to read article',
			icon: {path: './icons/Settings.png'},
			variables: {
				mode: 'service'
			},
			arg: helpUrl
		}])
	} else if (/^!.*/.test(input)) {
		alfy.output([{
			title: 'reset all settings and bookmarks',
			subtitle: 'hit ↵ to reset',
			icon: {path: './List Filter Images/4691613d5629fcba4730226e2575d85b1cfc2e39.png'},
			variables: {
				settingMode: 'reset'
			}
		}])
	} else {
		return 'adjusted'
	}
}
