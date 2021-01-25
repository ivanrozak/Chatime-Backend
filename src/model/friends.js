const connection = require('../config/mysql')

module.exports = {
  addFriend: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO friends SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              friend_id: result.insertedId,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  checkFriend: (data) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM friend WHERE user_id = ${data.user_id} AND user_friend_id = ${data.user_friend_id}`,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
