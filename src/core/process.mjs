import { fork } from 'child_process'
import { logger } from './logger.mjs'

export const deploy = ({
  path,
  onmessages,
  onexit,
  onerror,
  onclose,
  ondisconnect,
  onspawn,
  verbose = false
}) => fork(path)
    .on('message', logger('message', onmessages, verbose))
    .on('error', logger('error', onerror, verbose))
    .on('disconnect', logger('disconnect', ondisconnect, verbose))
    .on('spawn', logger('spawn', onspawn, verbose))
    .on('exit', logger('exit', onexit, verbose))
    .on('close', logger('close', onclose, verbose))

export const plugins = {
  names: () => new Promise(resolve => {
    const path = './src/core/plugins.mjs'
    const onmessages = ({ data }) => resolve(data)
    deploy({
      path,
      onmessages
    })
  })
}
