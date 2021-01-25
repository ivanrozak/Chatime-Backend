const connection = require('../config/mysql')

module.exports = {
  addFriendModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO friends SET ?',
        setData,
        (error, result) => {
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
        }
      )
    })
  },
  getFriendModel: (user_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT user.user_id, user.user_email, user.user_name, user.user_image FROM friends RIGHT JOIN user ON user.user_id = friends.friend_id WHERE friends.user_id = ? AND friend_status = 1',
        [user_id],
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
  confirmNewFriendModel: (user_id, friend_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE friends SET friend_status = 1 WHERE user_id = ${user_id} AND friend_id = ${friend_id}`,
        (error, result) => {
          console.log(result)
          const newResult = {
            user_id,
            friend_id,
            friend_status: 1
          }
          if (!error) {
            resolve(newResult)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  },
  getFriendStatusModel: (a, b) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM friends WHERE user_id = ? AND friend_id = ?',
        [a, b],
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
  getFriendRequestModel: (user_id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT user.user_id, user.user_email, user.user_name , user.user_image FROM friends RIGHT JOIN user ON user.user_id = friends.user_id WHERE friend_id = ? AND friend_status = 0',
        [user_id],
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
