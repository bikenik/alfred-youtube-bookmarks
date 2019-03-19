
'use strict'
const jsonfile = require('jsonfile')

const dbFile = './src/input/db.json'

const alfy = require('alfy')

if (process.argv[3] === 'id' && process.argv[2]) {
	alfy.config.set('id', process.argv[2])
}

if (process.argv[3] === 'secret' && process.argv[2]) {
	alfy.config.set('secret', process.argv[2])
}

if (process.argv[3] === 'reset') {
	alfy.config.clear()
	alfy.cache.clear()
	jsonfile.writeFile(dbFile, [], {
		spaces: 2
	}, error => {
		if (error !== null) {
			console.error(error)
		}
	})
}
