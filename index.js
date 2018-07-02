const level = require('level')
// db.put('a', 'b')
const head = require('./src/head')

const db = level('../tx-index/data/btc.db')

head(db, 10)
