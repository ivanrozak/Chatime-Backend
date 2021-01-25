const router = require('express').Router()
const {
  registerUser,
  loginUser,
  updateUser,
  getUserByEmail
} = require('../controller/user')
const uploadImage = require('../middleware/multerUser')

router.post('/register', uploadImage, registerUser)
router.patch('/:email/update', uploadImage, updateUser)
router.post('/login', loginUser)
router.get('/:email', getUserByEmail)

module.exports = router
