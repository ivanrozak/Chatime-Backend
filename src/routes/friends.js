const router = require('express').Router()
// const { authorization } = require('../middleware/auth')

const {
  addNewFriend,
  getFriendInvitation,
  confirmFriendRequest,
  getFriendList
} = require('../controller/friends')

router.get('/invitation/:id', getFriendInvitation)
router.get('/friendList/:id', getFriendList)
router.post('/add', addNewFriend)
router.patch('/confirm', confirmFriendRequest)

module.exports = router
