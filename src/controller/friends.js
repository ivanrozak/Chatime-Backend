const helper = require('../helper/response')

const {
  addFriendModel,
  getFriendModel,
  confirmNewFriendModel,
  getFriendStatusModel,
  getFriendRequestModel
} = require('../model/friends')

module.exports = {
  addNewFriend: async (request, response) => {
    const { user_id, friend_id } = request.body
    const checkFriendStatus = await getFriendStatusModel(user_id, friend_id)
    if (checkFriendStatus.length > 0) {
      console.log(checkFriendStatus[0].status)
      return helper.response(
        response,
        400,
        'You was sent friend request before'
      )
    } else {
      try {
        const setData = {
          user_id,
          friend_id,
          friend_created_at: new Date(),
          friend_status: 0
        }
        const result = await addFriendModel(setData)
        console.log(result)
        return helper.response(
          response,
          200,
          'Success Sent Friend Request',
          result
        )
      } catch (error) {
        return helper.response(response, 400, 'Bad Request', error)
      }
    }
  },
  getFriendInvitation: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getFriendRequestModel(id)
      return helper.response(
        response,
        200,
        'Success get friend request',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getFriendList: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getFriendModel(id)
      return helper.response(response, 200, 'Success get friend list', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  confirmFriendRequest: async (request, response) => {
    const { user_id, friend_id } = request.body
    try {
      const result = await confirmNewFriendModel(user_id, friend_id)
      return helper.response(response, 200, 'Friend Request Accepted', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
