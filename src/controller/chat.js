const helper = require('../helper/response')
const {
  postRoomModel,
  getRoomModel,
  updateRoomModel,
  listRoomModel
} = require('../model/roomChat')
const {
  postChatModel,
  getChatModel,
  getLastChatModel
} = require('../model/chat')

module.exports = {
  getChatData: async (request, response) => {
    try {
      const { room_id } = request.body
      const result = await getChatModel(room_id)
      if (result.length > 0) {
        return helper.response(response, 200, 'Here your chat history', result)
      } else {
        return helper.response(
          response,
          404,
          `You've never chat with him, let's chat now !`
        )
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  postChat: async (request, response) => {
    try {
      const { sender_id, receiver_id, message } = request.body
      const checkRoom = await getRoomModel(sender_id, receiver_id)
      if (checkRoom.length > 0) {
        const setData = {
          room_id: checkRoom[0].room_id,
          sender_id: sender_id,
          receiver_id: receiver_id,
          message: message,
          created_at: new Date()
        }
        const result = await postChatModel(setData)
        const updateDateroom = {
          room_updated_at: new Date()
        }
        const rooms = parseInt(result.room_id)
        await updateRoomModel(updateDateroom, rooms)
        return helper.response(response, 200, 'Success post chat', result)
      } else {
        const newRoom = Math.floor(Math.random() * 9999)
        const setRoom1 = {
          room_id: newRoom,
          user_a: sender_id,
          user_b: receiver_id,
          room_created_at: new Date(),
          room_updated_at: new Date()
        }
        await postRoomModel(setRoom1)
        const setRoom2 = {
          room_id: newRoom,
          user_a: receiver_id,
          user_b: sender_id,
          room_created_at: new Date(),
          room_updated_at: new Date()
        }
        await postRoomModel(setRoom2)
        const setData = {
          room_id: newRoom,
          sender_id: sender_id,
          receiver_id: receiver_id,
          message: message,
          created_at: new Date()
        }
        const result = await postChatModel(setData)
        return helper.response(response, 200, 'Success post chat', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getRoomlist: async (request, response) => {
    try {
      const { id } = request.params
      const result = await listRoomModel(id)
      if (result.length > 0) {
        result[0].lastChat = await getLastChatModel(result[0].room_id)
        return helper.response(response, 200, 'Success get data room', result)
      } else {
        return helper.response(
          response,
          404,
          'There are no room, Start chat now!'
        )
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
