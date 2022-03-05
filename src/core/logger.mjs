
export const logger = (name, callback, verbose) => (msg) => {
  if (verbose) {
    console.table({
      event: name,
      pid: process.pid,
      script: process.argv[1],
      msg
    })
  }
  if (callback) callback(msg)
}
