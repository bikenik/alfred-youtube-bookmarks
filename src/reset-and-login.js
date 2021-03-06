
'use strict'
const jsonfile = require('jsonfile')

const dbFile = `${process.env.alfred_workflow_data}/db.json`

const alfy = require('alfy')

if (process.argv[3] === 'id' && process.argv[2]) {
	alfy.config.set('GOOGLE_CLIENT_ID', process.argv[2])
}

if (process.argv[3] === 'secret' && process.argv[2]) {
	alfy.config.set('GOOGLE_CLIENT_SECRET', process.argv[2])
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
