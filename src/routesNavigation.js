const router = require('express').Router()
const user = require('./routes/user')
const chat = require('./routes/chat')
const friends = require('./routes/friends')

router.use('/user', user)
router.use('/chat', chat)
router.use('/friends', friends)

module.exports = router
