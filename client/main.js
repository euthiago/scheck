import { createApp } from 'vue'
import App from './App.vue'
import { manageServiceWorkerRegistration } from './plugins/notification'

/*
	SW
*/
manageServiceWorkerRegistration()

/*
	App
*/
createApp(App).mount('#app')


