#!/usr/bin/env node

const program = require('commander')
const {version} = require('../package.json')
const {logTransform} = require('../src/stream')
const fs = require('fs')

program
  .version(version)
  .option('-p, --path <path>', 'Path to leveldb', '.')
  .option('-n, --limit <limit>', 'Stop reading after "limit" entries')
  .option('-f, --from <from>', 'Read records starting at "from".')
  .option('-t, --to <to>', 'Read records until "to".')
  .option('-k, --keyEncoding <encoding>', 'key encoding [utf8, ascii, json, hex]', 'utf8')
  .option('-v, --valueEncoding <encoding>', 'value encoding [utf8, ascii, json, hex]', 'utf8')

program
  .command('keys')
  .action(() => run({keys: true, values: false}))

program
  .command('values')
  .action(() => run({values: true, keys: false}))

program
  .command('list')
  .action(() => run({values: true, keys: true}))

program.parse(process.argv)

function run (options = {}) {
  if (program.from !== undefined) { options.gte = program.from }
  if (program.to !== undefined) { options.lte = program.to }
  if (program.limit !== undefined) { options.limit = parseInt(program.limit) }
  const config = {}
  if (program.keyEncoding !== undefined) { config.keyEncoding = program.keyEncoding }
  if (program.valueEncoding !== undefined) { config.valueEncoding = program.valueEncoding }

  // console.log('Options: %o', {...options, ...config})
  // console.log(`Reading from ${program.path}:`)

  const entries = fs.readdirSync(program.path)
  if (!(entries.indexOf('LOG') >= 0)) {
    return console.log('No level db was found at', program.path)
  }

  const level = require('level')
  const db = level(program.path, config)
  db.createReadStream(options)
    .pipe(logTransform())
}
