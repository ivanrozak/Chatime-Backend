const route = require('express').Router()
const { postChat, getChatData, getRoomlist } = require('../controller/chat')

route.get('/room/:id', getRoomlist)
route.post('/getData', getChatData)
route.post('/', postChat)
module.exports = route
