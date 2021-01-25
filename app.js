const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const routesNavigation = require('./src/routesNavigation')
// ===================
const socket = require('socket.io')
// ====================
const app = express()
app.use(cors())
app.use(express.static('uploads'))

// ====================
const http = require('http')
const server = http.createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  }
})
io.on('connection', (socket) => {
  console.log('socket.io Connect!')
  // global message = pesan ke semua klien
  // pruvate message = hanya dikirim ke client saja, biasa digunakan untuk membuat bot yang mrngirim message kehalaman itu saja
  // broadcast message = pesan yg dikirim ke semua klien kecuali ke si pengirim, bisa diimplement di notifikasi
  // room = ruang pesan yang bisa diakses/ dimasuki client
  socket.on('globalMessage', (data) => {
    console.log(data)
    io.emit('chatMessage', data)
  })
  socket.on('privateMessage', (data) => {
    socket.emit('chatMessage', data)
  })
  socket.on('broadcastMessage', (data) => {
    socket.broadcast.emit('chatMessage', data)
  })
  socket.on('joinRoom', (data) => {
    console.log(data)
    socket.join(data.room)
    socket.broadcast.to(data.room).emit('chatMessage', {
      username: 'BOT',
      message: `${data.username} Joined Chat !`
    })
  })
  socket.on('changeRoom', (data) => {
    console.log(data)
    socket.leave(data.oldRoom)
    socket.join(data.room)
    socket.broadcast.to(data.room).emit('chatMessage', {
      username: 'BOT',
      message: `${data.username} Joined Chat !`
    })
  })
  socket.on('roomMessage', (data) => {
    io.to(data.room).emit('chatMessage', data)
  })
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('typingMessage', data)
  })
})
// ====================

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.use('/', routesNavigation)
app.get('*', (request, response) => {
  response.status(404).send('Path not found !')
})

//diubah dari app menjadi server
server.listen(3000, () => {
  console.log('Listening on Port 3000')
})
