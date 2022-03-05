import fs from 'fs'

import path from 'path'
fs.readdir(path.join('./src/plugins'), async (error, files) => {
  if (error) process.send({ error })
  process.send({
    data: files
      .filter(
        file => file
          .includes('.mjs')
      )
      .map(
        pluginName => pluginName
          .replace('-plugin.mjs', '')
          // tentative to later .replace(/-/g, ' ')
      )
  })
})