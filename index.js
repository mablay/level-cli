#!/usr/bin/env node

const level = require('level')
const program = require('commander')
const readline = require('readline')
const fs = require('fs')
const {version} = require('./package.json')

program
  .version(version)
  .option('-p, --path <path>', 'Path to leveldb', '.')
  .option('-n, --limit <limit>', 'Stop reading after "limit" entries')
  .option('-f, --from <from>', 'Read records starting at "from".')
  .option('-t, --to <to>', 'Read records until "to".')
  .option('-r, --reverse', 'Reverse order', true)
  .option('-k, --keyEncoding <encoding>', 'key encoding [utf8, ascii, json, hex]', 'utf8')
  .option('-v, --valueEncoding <encoding>', 'value encoding [utf8, ascii, json, hex]', 'utf8')
  .option('-v, --valueEncoding <encoding>', 'value encoding [utf8, ascii, json, hex]', 'utf8')

program.command('keys').alias('k')
  .action(() => stream({keys: true, values: false}))

program.command('values').alias('v')
  .action(() => stream({values: true, keys: false}))

program.command('list').alias('l')
  .action(() => stream({values: true, keys: true}))

program.command('get <key>').alias('g')
  .action((key, cmd) => {
    createLevel()
      .get(key)
      .then(console.log)
      .catch(err => console.error(err.message))
  })

program.command('put <key> <value>').alias('p')
  .action((key, value) => {
    createLevel()
      .put(key, value)
      .catch(err => console.error(err.message))
  })

program.command('del <key>').alias('d')
  .action((key) => {
    const db = createLevel()
    if (!db) return
    db.get(key)
      .then(value => ask(`Record "${key}" has value "${value}". Do you really want to delete it? (y/N)\n`))
      .then(answer => {
        if (answer === 'y') return db.del(key)
      })
      .catch(err => console.error(err.message))
  })

program.command('*', {noHelp: true}).action(printHelp)

program.parse(process.argv)
if (program.args.length === 0) printHelp()

function printHelp () {
  program.outputHelp()
  process.exit(0)
}

function createLevel () {
  const entries = fs.readdirSync(program.path)
  if (!(entries.indexOf('LOG') >= 0)) {
    console.log('Error: No level db was found at '.concat(program.path))
    return false
  }
  const {keyEncoding, valueEncoding} = program
  return level(program.path, {keyEncoding, valueEncoding})
}

function stream (options = {}) {
  if (program.from !== undefined) { options.gte = program.from }
  if (program.to !== undefined) { options.lte = program.to }
  if (program.limit !== undefined) { options.limit = parseInt(program.limit) }
  if (program.reverse) { options.reverse = program.reverse }

  const db = createLevel()
  if (!db) return
  db.createReadStream(options).on('data', console.log)
}

function ask (query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}
