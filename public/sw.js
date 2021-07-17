/*
	Gerenciando os eventos de push notification
*/

console.log("SW")

self.registration.pushManager.getSubscription()
	.then(function(subscription) {

	console.log("subscription from SW")
	console.log(JSON.stringify(subscription))

})

self.addEventListener('push', function(event) {
	console.log('[Service Worker] Push Received.')
	console.log(event)

	const title = 'Mudança no texto'
	const options = {
		body: event.data.text(),
	}

	event.waitUntil(self.registration.showNotification(title, options))
});