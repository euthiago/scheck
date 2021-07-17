import Fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import { receiveSubscription, notifyAllSubscriptions } from './notification.js'

let fastify = Fastify({ logger: true })


/*
	Static / SPA index
*/
// fastify.get("/*", fastify.use('/css/*', serveStatic('../client')))
fastify.register(fastifyStatic, {
	root: path.join(process.cwd(), 'dist/client'),
})

fastify.post('/subscribe', async ( req, reply ) => {

	let parsedBody = JSON.parse(req.body)

	let operationResult = await receiveSubscription(parsedBody.subscription)
	
	if(operationResult === true){
		return reply.send("ok")
	}
	return reply.send("not ok")

} )

fastify.get('/notify', async ( req, reply ) => {

	/*
		Notificando
	*/
	notifyAllSubscriptions("Notificação "+Date.now())

	reply.send("ok")

})

// Run the fastify!
const start = async () => {
	try {
		await fastify.listen(1337)
		console.log("fastify up")
		
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()