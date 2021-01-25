const connection = require('../config/mysql')

module.exports = {
  postRoomModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO room set ?', setData, (error, result) => {
        console.log(result)
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
  getRoomModel: (user_a, user_b) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room WHERE user_a = ? && user_b = ?',
        [user_a, user_b],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  },
  updateRoomModel: (setData, room_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE room SET ? WHERE room_id = ?',
        [setData, room_id],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  },
  listRoomModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room join user on user_b = user_id where user_a = ? ORDER BY room.room_updated_at DESC',
        id,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  }
}
