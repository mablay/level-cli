# LevelDB command line interface

Inspect and alter your leveldb records with the command line.

Similar to [lev](https://github.com/hxoht/lev)

## Setup

    npm i -g level-cli

## Usage

    Usage: lev [command] [options]

    Commands:                         Alias:

      keys                            k
      values                          v
      list                            l
      get <key>                       g
      put <key> <value>               p
      del <key>                       d
          
    Options:

      -V, --version                   output the version number
      -p, --path <path>               Path to leveldb (default: . )
      -n, --limit <limit>             Stop reading after "limit" entries
      -f, --from <from>               Read records starting at "from"
      -t, --to <to>                   Read records until "to"
      -r, --reverse                   Reverse order
      -k, --keyEncoding <encoding>    key encoding [utf8, ascii, json, hex] (default: utf8)
      -v, --valueEncoding <encoding>  value encoding [utf8, ascii, json, hex] (default: utf8)
      -h, --help                      output usage information

## Example

    lev keys -n 10

## Troubleshooting

Some shells treat the `!` symbol specifically. 
Thus, if you encounter sth. like that:

    lev put a!foo bar
    
    => -bash: !foo: event not found

It means you're using [history substitution](https://serverfault.com/questions/208265/what-is-bash-event-not-found)
which you can turn off / on using `set +H` / `set -H`.