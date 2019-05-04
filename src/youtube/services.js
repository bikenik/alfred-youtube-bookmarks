/* eslint no-useless-concat: "off" */
/* eslint camelcase: ["error", {properties: "never"}] */
/* eslint camelcase: ["error", {allow: ["^client_","access_token","grant_type","refresh_token"]}] */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^_" }] */

module.exports = {
	playlist: {
		query: {
			part: 'snippet' + ',' + 'contentDetails' + ',' + 'status',
			mine: true,
			maxResults: '50'
		},
		url: 'https://www.googleapis.com/youtube/v3/playlists',
		map: ({snippet, contentDetails, id}) => {
			return {
				title: snippet.title,
				subtitle: `Count: ${contentDetails.itemCount} \t ${snippet.description}`,
				text: {largetype: `${snippet.title}\n\n${snippet.description}\n\n${snippet.publishedAt.toString().slice(0, 10)} / ${snippet.publishedAt.toString().slice(11, 16)}`},
				arg: `https://www.youtube.com/playlist?list=${id}`,
				mods: {
					alt: {
						subtitle: 'show this playlist by each items',
						arg: id
					}
				},
				icon: {path: './List Filter Images/02e45e931e822c2ad82cb3c236f66605269ce818.png'},
				variables: {
					mode: 'service'
				}
			}
		}
	},
	playlistItems: {
		query: {
			part: 'snippet' + ',' + 'contentDetails',
			playlistId: process.env.playlistId,
			maxResults: '50'
		},
		url: 'https://www.googleapis.com/youtube/v3/playlistItems',
		map: ({snippet}) => {
			return {
				title: snippet.title,
				icon: {path: './List Filter Images/02e45e931e822c2ad82cb3c236f66605269ce818.png'},
				subtitle: snippet.description,
				text: {largetype: `${snippet.title}\n\n${snippet.description}\n\n${snippet.publishedAt.toString().slice(0, 10)} / ${snippet.publishedAt.toString().slice(11, 16)}`},
				arg: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}&list=${snippet.playlistId}`,
				variables: {
					mode: 'service'
				}
			}
		}
	},
	channel: {
		query: {
			part: 'snippet' + ',' + 'contentDetails' + ',' + 'statistics',
			mine: true
		},
		url: 'https://www.googleapis.com/youtube/v3/channels',
		map: ({snippet, id, statistics}) => {
			return {
				title: snippet.title,
				subtitle: `videoCount: ${statistics.videoCount} / Comment Count: ${statistics.commentCount} / Subscriber Count: ${statistics.subscriberCount} /View count: ${statistics.viewCount}`,
				arg: `https://www.youtube.com/channel/${id}`,
				variables: {
					mode: 'service'
				}
			}
		}
	},
	activities: {
		query: {
			part: 'snippet' + ',' + 'contentDetails',
			mine: true,
			maxResults: '50'
		},
		url: 'https://www.googleapis.com/youtube/v3/activities',
		map: ({snippet, contentDetails}) => {
			return {
				title: snippet.title,
				subtitle: snippet.description,
				arg: `https://www.youtube.com/watch?v=${contentDetails.playlistItem && contentDetails.playlistItem.resourceId ? contentDetails.playlistItem.resourceId.videoId : contentDetails.upload ? contentDetails.upload.videoId : ''}`,
				icon: {path: snippet.type === 'playlistItem' ? './List Filter Images/02e45e931e822c2ad82cb3c236f66605269ce818.png' : snippet.type === 'upload' ? './icons/Upload.png' : './icon.png'},
				text: {
					largetype: `${snippet.title}n${snippet.descriptionß}`
				},
				variables: {
					mode: 'service'
				}
			}
		}
	}
}
