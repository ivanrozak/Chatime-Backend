const connection = require('../config/mysql')
module.exports = {
  postChatModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO chat SET ?', setData, (error, result) => {
        const newResult = {
          ...setData
        }
        if (!error) {
          resolve(newResult)
        } else {
          console.log(error)
          reject(new Error(error))
        }
      })
    })
  },
  getChatModel: (room_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT message, room_id, sender_id, receiver_id, created_at FROM chat WHERE room_id = ? ORDER BY created_at ASC',
        room_id,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  getLastChatModel: (room_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM chat WHERE room_id = ? ORDER BY created_at DESC',
        room_id,
        (error, result) => {
          if (!error) {
            resolve(result[0])
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
