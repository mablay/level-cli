const level = require('level')
function stream (path, options) {
  const db = level(path)
  return db.createReadStream(options)
}

const {Transform} = require('stream')
function logTransform () {
  return new Transform({
    objectMode: true,
    transform: (data, encoding, next) => {
      console.log(data)
      next()
    }
  })
}

module.exports = {
  stream,
  logTransform
}
