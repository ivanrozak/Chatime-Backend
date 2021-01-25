const multer = require('multer')
const helper = require('../helper/response')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/users')
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error('Extention file must be png or jpeg'), false)
  }
}

const uploadLimit = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
}).single('user_image')

const uploadFilter = (req, res, next) => {
  uploadLimit(req, res, function (err) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return helper.response(res, 400, 'Max size 2MB !')
    } else if (err instanceof multer.MulterError) {
      return helper.response(res, 400, err.message)
    } else if (err) {
      return helper.response(res, 400, err.message)
    }
    next()
  })
}

module.exports = uploadFilter
