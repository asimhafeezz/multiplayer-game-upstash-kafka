const { Kafka } = require("kafkajs")
const { updatePlayerState } = require("./players")

const kafka = new Kafka({
	brokers: ["upright-shad-9858-us1-kafka.upstash.io:9092"],
	sasl: {
		mechanism: "scram-sha-256",
		username: "dXByaWdodC1zaGFkLTk4NTgkgKQrp3Gg8rg1l6rbQGcmy8dh9JVo7gxX8S5P9rw",
		password: "NjU5ZTkyNjctMzVmZC00Y2M4LTg1ZGUtYmY2NzIwOGZkNmI5",
	},
	ssl: true,
})

const consumer = kafka.consumer({ groupId: "players-state" })
const producer = kafka.producer()

// on succesfull connection to kafka broker
consumer.on("consumer.group_join", () => {
	console.log("Consumer connected to kafka broker!")
})

// on disconnect from kafka broker
consumer.on("consumer.stop", () => {
	console.log("Consumer disconnected from kafka broker!")
})

const consume = async () => {
	await consumer.connect()
	await consumer.subscribe({ topic: "players-state" })
	await consumer.run({
		eachMessage: async ({ __, _, message }) => {
			const updatedPlayerState = JSON.parse(message.value)
			console.log({ updatedPlayerState })
			updatePlayerState(updatedPlayerState)
		},
	})
}

const produce = async message => {
	await producer.connect()
	await producer.send({
		topic: "players-state",
		messages: [{ value: JSON.stringify(message) }],
	})
}

module.exports = { kafka, consume, produce }
