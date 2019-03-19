module.exports = class WorkflowError extends Error {
	constructor(message, data) {
		// `data` is an object with the following optional props:
		//   .tip - message to show so the user can fix the error
		//   .autocomplete - self-explanatory
		// if (message === 'failed to connect to AnkiConnect') {
		// 	data.icon.path = './icons/not-connected.png'
		// }
		super(message)
		this.name = 'Workflow'

		Object.assign(this, data)
	}
}
