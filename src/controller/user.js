const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../helper/response')
const {
  registerUserModel,
  checkEmailModel,
  patchUserModel
} = require('../model/user')
const fs = require('fs')

module.exports = {
  registerUser: async (request, response) => {
    try {
      const { user_name, user_email, user_password } = request.body
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(user_password, salt)
      const setData = {
        user_name,
        user_email,
        user_password: encryptPassword,
        user_created_at: new Date()
      }
      const checkSameEmail = await checkEmailModel(user_email)
      if (checkSameEmail.length > 0) {
        return helper.response(
          response,
          400,
          'Email has been used by another user, try with another email'
        )
      }
      const result = await registerUserModel(setData)
      return helper.response(response, 200, 'Success Post User', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  loginUser: async (request, response) => {
    try {
      const { user_email, user_password } = request.body
      const checkDataUser = await checkEmailModel(user_email)
      if (checkDataUser.length > 0) {
        const checkPassword = bcrypt.compareSync(
          user_password,
          checkDataUser[0].user_password
        )
        if (checkPassword) {
          const { user_id, user_name, user_email } = checkDataUser[0]
          const payload = {
            user_id,
            user_name,
            user_email
          }
          const token = jwt.sign(payload, 'RAHASIA', { expiresIn: '24h' })
          const result = { ...payload, token }
          return helper.response(response, 200, 'Success get token !', result)
        } else {
          return helper.response(response, 400, 'Wrong Password !')
        }
      } else {
        return helper.response(
          response,
          400,
          'Email / Account not registered !'
        )
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  updateUser: async (request, response) => {
    try {
      const { email } = request.params
      const {
        user_name,
        user_phone,
        user_desc,
        user_lat,
        user_lng
      } = request.body

      let newImg
      const checkImg = await checkEmailModel(email)

      if (checkImg[0].user_image) {
        newImg = request.file.filename
        fs.unlink(`./uploads/users/${checkImg[0].user_image}`, (err) => {
          if (err) throw err
          console.log('Success Delete Image')
        })
      } else {
        newImg = checkImg[0].user_image
      }
      const setData = {
        user_name,
        user_phone,
        user_desc,
        user_lat,
        user_lng,
        user_image: request.file === undefined ? '' : request.file.filename,
        user_updated_at: new Date()
      }
      const checkEmail = await checkEmailModel(email)
      if (checkEmail.length > 0) {
        const result = await patchUserModel(setData, email)
        return helper.response(
          response,
          200,
          'Success Update Your Profile',
          result
        )
      } else {
        return helper.response(
          response,
          404,
          `User by Email: ${email} Not Found`
        )
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getUserByEmail: async (request, response) => {
    try {
      const { email } = request.params
      const result = await checkEmailModel(email)
      if (result.length > 0) {
        return helper.response(
          response,
          200,
          'Success Get User By Email',
          result
        )
      } else {
        return helper.response(
          response,
          404,
          `User By Email : ${email} Not Found`
        )
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
