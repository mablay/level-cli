#!/usr/bin/env node

import { ClassicLevel } from 'classic-level'
import { program } from 'commander'
import { createInterface } from 'readline/promises'
import { readdirSync } from 'node:fs'

program
  .version('0.3.1')
  .option('-p, --path <path>', 'Path to leveldb', '.')
  .option('-l, --limit <limit>', 'Stop reading after "limit" entries')
  .option('-f, --from <from>', 'Read records starting at "from".')
  .option('-t, --to <to>', 'Read records until "to".')
  .option('-r, --reverse', 'Reverse order', false)
  .option('-k, --keyEncoding <encoding>', 'key encoding [utf8, ascii, json, hex]', 'utf8')
  .option('-v, --valueEncoding <encoding>', 'value encoding [utf8, ascii, json, hex]', 'utf8')

program.command('keys')
  .description('list keys')
  .action(async () => {
  const iterator =  openLevelDB().keys(getIteratorOptions())
  for await (const record of iterator) console.log(record)
})

program.command('values')
  .description('list values')
  .action(async () => {
  const iterator =  openLevelDB().values(getIteratorOptions())
  for await (const record of iterator) console.log(record)
})

program.command('list')
  .description('list key value pairs')
  .action(async () => {
  const iterator =  openLevelDB().iterator(getIteratorOptions())
  for await (const [key, value] of iterator) console.log({key, value})
})

program.command('get <key>')
  .description('get the value for a key')
  .action((key) => {
  openLevelDB().get(key)
    .then(console.log)
    .catch(err => console.error(err.message))
})

program.command('put <key> <value>')
  .description('write the value for a key')
  .action((key, value) => {
    openLevelDB()
      .put(key, value)
      .catch(err => console.error(err.message))
})

program.command('del <key>')
  .option('-y, --yes', 'confirm deletion')
  .description('delete a key')
  .action(async (key, { yes } = {}) => {
  const db = openLevelDB()
  try {
    if (!yes) {
      const value = await db.get(key)
      if (value === undefined) {
        console.log('record does not exist')
        process.exit()
      }
      console.log({ key, value })
      const answer = await ask('Do you really want to delete this record? (y/N)\n')
      if (answer.toLowerCase() !== 'y') return
    }
    db.del(key)
  } catch (error) {
    console.error(error.message)
  }
})

program.command('create <path>')
  .description('create a LevelDB at a given path')
  .action((path) => {
    new ClassicLevel(path)
  })

program.parse(process.argv)

function openLevelDB() {
  const { path, keyEncoding, valueEncoding } = program.opts()
  const entries = readdirSync(path)
  if (!(entries.indexOf('LOG') >= 0)) {
    console.warn(`Error: No level db was found at ${path}`)
    process.exit(1)
  }
  return new ClassicLevel(path, { keyEncoding, valueEncoding })
}

function getIteratorOptions (iteratorOptions = {}) {
  const opts = program.opts()
  if (opts.from !== undefined) iteratorOptions.gte = opts.from
  if (opts.to !== undefined) { iteratorOptions.lte = opts.to }
  if (opts.limit !== undefined) { iteratorOptions.limit = parseInt(opts.limit) }
  if (opts.reverse) { iteratorOptions.reverse = opts.reverse }
  return iteratorOptions
}

async function ask(query) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const answer = await rl.question(query)
  rl.close()
  return answer
}