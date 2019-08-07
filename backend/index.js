const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 4000

app.get('/', (req, res) => res.send('Hello World'))

const dummyDb = { subscription: null } //dummy in memory store

const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}

// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body
  await saveToDatabase(subscription) //Method to save the subscription to Database
  res.json({ message: 'success' })
})

const vapidKeys = {
    publicKey: 'BPXi5ocqGCdMnF3QEWCJwBkYezEi-j8qUCJoVp53dn8O3N11fRHEz8Q9BcomKyh97kg4i1j5TZrbwdDiAHqvYFA',
    privateKey: 'NdxxkTYfyI2uHES7mj4arBPsyqUbsluYtZOGEKoyqIA'
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:cloud.han.xiao@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend='') => {
  webpush.sendNotification(subscription, dataToSend)
}

//route to test send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription //get subscription from your databse here.
  console.log(subscription)
  const message = '瓜叔下午好！'
  sendNotification(subscription, message)
  res.json({ message: 'message sent' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
