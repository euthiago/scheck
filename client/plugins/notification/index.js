/*
	Gerenciando nossa api de notificações
*/
import { publicKey } from '../../../server/keys'
import { isDev } from '../env'

/*
	Nosso sw registration
*/
let sw 

/*
	Gerencia o registro do sw
*/
const manageServiceWorkerRegistration = () => {

	if (isDev) return

	if ('serviceWorker' in navigator) {

		/*
			Registro da inscrição
		*/
		navigator.serviceWorker.register('/sw.js')
			.then(function (registration) {

				sw = registration

				sw.addEventListener('updatefound', function () {
					// If updatefound is fired, it means that there's
					// a new service worker being installed.
					var installingWorker = sw.installing
					console.log('A new service worker is being installed:',
						installingWorker)

					// You can listen for changes to the installing service worker's
					// state via installingWorker.onstatechange
				})

				/*
					Verificando estado da inscrição
				*/
				sw.pushManager.getSubscription()
				.then(function(subscription) {
					let isSubscribed = !(subscription === null);

					// updateSubscriptionOnServer(subscription);

					if (isSubscribed) {
						console.log('User IS subscribed.');
					} else {
						console.log('User is NOT subscribed.');
					}

					console.log(JSON.stringify(subscription))

					// updateBtn();
				});


			})
			.catch(function (error) {
				console.log('Service worker registration failed:', error)
			})
	} else {
		console.log('Service workers are not supported.')
	}
}

/*
	Se inscrevre para as notificações
*/
const subscribeToPushNotifications = () => {
	
	if(!sw) return 

	let options = {
		userVisibleOnly: true,
		applicationServerKey: publicKey
	}

	sw.pushManager.subscribe(options).then( pushSubscription => {
		
		/*
			Registando os dados da inscrição
		*/
		fetch('/subscribe', {
			method:'POST',
			body: JSON.stringify({ subscription: pushSubscription }),
			'Content-Type': 'application/json',
		}).then( result => console.log(result))

		// The push subscription details needed by the application
		// server are now available, and can be sent to it using,
		// for example, an XMLHttpRequest.
	}, error => {
		// During development it often helps to log errors to the
		// console. In a production environment it might make sense to
		// also report information about errors back to the
		// application server.
		console.log(error);
	})

}

const notifyCheck = () => 
	fetch("/notify")

export {
	sw,
	manageServiceWorkerRegistration,
	subscribeToPushNotifications,
	notifyCheck
}