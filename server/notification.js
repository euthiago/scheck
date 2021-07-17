import webpush from 'web-push'
import { publicKey, privateKey } from './keys.js'
import fse from 'fs-extra'
import fs from 'fs'
import path from 'path'

webpush.setVapidDetails(
	'mailto:thiagobrasilia@gmail.com',
	publicKey,
	privateKey
)

const filePath = "subscriptions.json"
const getFilePath = () => path.join(process.cwd(), 'dist/server', filePath)

const getSubscriptions = () => 
new Promise( async ( resolve, reject ) => {
	try {
		let file = fs.readFileSync(getFilePath(), 'utf-8')
		let json = JSON.parse(file)
		resolve(json)
	}catch(e){
		if(e.message === "Unexpected end of JSON input"){
			resolve({ subscriptions: [] }) 
		}
		reject(e)
	}
})

const saveSubscriptions = json => 
	new Promise( async (resolve, reject) => {
		try{
			fse.writeFileSync(getFilePath(), JSON.stringify(json))
			resolve(true)
		}catch(e){
			reject(e)
		}
	})
	

const receiveSubscription = subscription => 
	new Promise( async (resolve, reject ) => {
		try {
			/*
				Garantindo que o arquivo existe
			*/
			await fse.ensureFile(getFilePath())
			let json = await getSubscriptions()
			
			json.subscriptions = [
				...json.subscriptions.filter( s => s.keys.auth !== subscription.keys.auth),
				subscription
			]
		
			await saveSubscriptions(json)
			
			resolve(true)
	
			/*
				Notificando da nova inscrição
			*/
			let message = `Novo dispositivo ouvindo. ${json.subscriptions.length} no total.`
			notifyAllSubscriptions(message)

		}catch(e){
			console.log("erro ao salvar a subscrição", e)
			reject(e)
		}
	})

/*
	Envia a mensagem para todas as subscrições
*/
const notifyAllSubscriptions = async message => {

	// Subscriptions
	let { subscriptions=[] } = await getSubscriptions()

	console.log("enviando mensagem:", message)

	try {
		let results = await Promise.all(subscriptions.map( subscription => 
			webpush.sendNotification(subscription, message)
		))
		console.log("tudo certo")
		console.log(results)
	}catch( e ){
		console.log(e)
	}
	

}

export { 
	receiveSubscription,
	notifyAllSubscriptions
}
