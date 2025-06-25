# LevelDB command line interface

Inspect and alter your leveldb records with the command line.

Similar to [lev](https://github.com/hxoht/lev)

## Install

```sh
npm i -g level-cli
```

## Usage

```sh
Usage: level [options] [command]

Options:
  -V, --version                   output the version number
  -p, --path <path>               Path to leveldb (default: ".")
  -l, --limit <limit>             Stop reading after "limit" entries
  -f, --from <from>               Read records starting at "from".
  -t, --to <to>                   Read records until "to".
  -r, --reverse                   Reverse order (default: false)
  -k, --keyEncoding <encoding>    key encoding [utf8, ascii, json, hex] (default: "utf8")
  -v, --valueEncoding <encoding>  value encoding [utf8, ascii, json, hex] (default: "utf8")
  -h, --help                      display help for command

Commands:
  keys                            list keys
  values                          list values
  list                            list key value pairs
  get <key>                       get the value for a key
  put <key> <value>               write the value for a key
  del [options] <key>             delete a key
  create <path>                   create a LevelDB at a given path
  help [command]                  display help for command
```

## Example

Execute from within the leveldb folder

```sh
level create . # create a new LevelDB if you don't have one yet
level put foo bar
level put lorem ipsum
level list
level keys -l 1
level keys -l 1 --reverse
level del foo -y
```

## Troubleshooting

Some shells treat the `!` symbol specifically.
Thus, if you encounter sth. like that:

```sh
level put a!foo bar

=> -bash: !foo: event not found
```

It means you're using [history substitution](https://serverfault.com/questions/208265/what-is-bash-event-not-found)
which you can turn off / on using `set +H` / `set -H`.
