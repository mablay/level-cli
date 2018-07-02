const {Transform} = require('stream')
module.exports = (db, head) => {
  const stream = db.createReadStream()
    .pipe(new Transform({
      objectMode: true,
      transform: (data, encoding, next) => {
        console.log(data)
        head--
        if (head < 0) {
          stream.destroy()
        }
        next()
      }
    }))
}
