const {Transform} = require('stream')
module.exports = db => {
  db.createReadStream()
    .pipe(new Transform({
      objectMode: true,
      transform: (data, encoding, next) => {
        console.log(data)
        next()
      }
    }))
}
