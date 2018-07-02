const {Transform} = require('stream')
module.exports = (options, transform) => new Transform({
  ...options,
  ...transform
})
