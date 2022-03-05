import { deploy } from './core/process.mjs'
import { logger } from './core/logger.mjs'

const start = ({
  keyword,
  path,
  headless,
  exit,
  verbose
}) => {
  const plugin = deploy({
    path,
    onexit: logger('exit', console.log, verbose),
    onerror: logger('error', console.log, verbose),
    onclose: logger('close', console.log, verbose),
    onspawn: logger('spawn', console.log, verbose),
    ondisconnect: logger('disconect', console.log, verbose),
  }).on('message', ({ request }) => {
    if (request) {
      plugin.send({
        keyword,
        headless,
        exit
      })
    }
  })
}
const config = {
  path: './src/plugins/buscar-amazon-plugin.mjs',
  keyword: 'television',
  exit: 'exit',
  headless: true,
  verbose: false
}
start(config)
start(config)
start(config)
start(config)
