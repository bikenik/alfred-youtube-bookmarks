/* eslint no-return-assign: "error" */

const alfy = require('alfy')

const addBookmark = currentDB => {
	let myvar
	let currentInfo
	if (process.env.tdb) {
		currentInfo = JSON.parse(process.env.tdb)
		myvar = {
			bookmarks: [{
				comment: process.env.input ? process.env.input : alfy.input,
				tag: process.env.tag ? process.env.tag : null,
				startsAt: currentInfo.currentTime
			}],
			id: currentInfo.allData.video_id,
			owner: currentInfo.allData.author,
			title: currentInfo.allData.title,
			playlist: {
				title: currentInfo.playlist.title,
				sequence: currentInfo.playlist.sequence
			}
		}
	}

	const DB = currentDB
	const indexToAdd = DB.map((x, i) => {
		let index
		if (x.id === currentInfo.allData.video_id) {
			index = i
		}

		return index
	}).filter(x => x !== undefined)[0]
	if (typeof (indexToAdd) === 'number') {
		DB[indexToAdd].bookmarks.push(
			myvar.bookmarks[0]
		)
	} else {
		DB.push(myvar ? myvar : '')
	}

	alfy.output([{
		title: 'add your bookmark',
		arg: JSON.stringify(DB),
		icon: {path: './List Filter Images/92f6721c1c5abf70d54511205a35ac71a9f06e96.png'},
		variables: {mode: 'regular'}
	},
	{
		title: process.env.tag ? process.env.tag : 'add some tag',
		icon: {path: './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'},
		variables: {
			mode: 'show-tags',
			input: alfy.input
		}
	}])
}

const tag = currentDB => {
	function removeDuplicates(arr) {
		const uniqueArray = []
		const data = []
		arr.forEach(elem => {
			if (uniqueArray.indexOf(elem) === -1) {
				uniqueArray.push(elem)
				data.push(elem)
			}
		})
		return data
	}

	const tags = currentDB.map(y => y.bookmarks
		.filter(x => x.tag).map(x => x.tag)).reduce((arr, allArr) => [...arr, ...allArr], [])
	const result = removeDuplicates(tags).map(x => {
		return (x = {
			title: x,
			icon: {path: './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'},
			arg: x
		})
	})
	const items = alfy.inputMatches(result, 'title')
	if (items.length === 0) {
		items.push({
			title: `new tag will: '${alfy.input}'`,
			arg: alfy.input.replace(/\s/g, '_'),
			icon: {path: './List Filter Images/78303f403137dc57c4f5809e177bd5f46b892d0f.png'}
		})
	}

	alfy.output(items)
}

const playlist = currentDB => {
	function removeDuplicates(arr) {
		const uniqueArray = []
		const data = []
		arr.forEach(elem => {
			if (uniqueArray.indexOf(elem) === -1) {
				uniqueArray.push(elem)
				data.push(elem)
			}
		})
		return data
	}

	const playlists = currentDB.filter(x => x.playlist.title).map(x => x.playlist.title)
	const result = removeDuplicates(playlists).map(x => {
		return (x = {
			title: x,
			icon: {path: './List Filter Images/f54766acb7bc462bd0e0bc1a34b9dab62ca0d383.png'},
			arg: x
		})
	})
	const items = alfy.inputMatches(result, 'title')
	alfy.output(items)
}

module.exports = {addBookmark, tag, playlist}
