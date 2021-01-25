const helper = require('../helper/response')

const { checkFriend, addFriend } = require('../model/friends')

const { checkEmailModel } = require('../model/user')

module.exports = {
  addFriend: async (req, res) => {
    try {
      const { userId, friendEmail } = req.body

      const checkEmail = await checkEmailModel(friendEmail)
      if (checkEmail.length === 0) {
        return helper.response(res, 400, 'user by email not found')
      }

      const friendId = checkEmail[0].user_id

      const setData = {
        user_id: userId,
        user_friend_id: friendId
      }

      let friend = await getUserById(friendId)
      friend = friend[0].user_name

      const check = await checkFriend(setData)

      if (check.length > 0) {
        return helper.response(res, 200, `You already friends with ${friend}`)
      }

      const result = await addFriend(setData)

      return helper.response(
        res,
        200,
        `${friend} added to your friend list`,
        result
      )
    } catch (error) {
      return helper.response(res, 400, 'Bad Request', error)
    }
  }
}
