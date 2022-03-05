import { amazon } from '../scripts/amazon.mjs'

process.on('message', ({
  keyword,
  headless,
  end
}) => {

  (async () => {
    try {
      await amazon(keyword, headless, end)
    } catch (e) {
      process.send({ msg: e.message })
      process.exit(1)
    }
  })()
})

process.send({
  request: {
    keyword: true,
    headless: true,
    exit: true
  }
})
