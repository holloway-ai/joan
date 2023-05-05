const { timeBlock } = require('./timestamp-parser');
const { formatter } = require('./formatter');

module.exports = {
  init (mdinst, conf) {
    mdinst.use((md, opts) => {
      md.block.ruler.at('paragraph', timeBlock)
      md.core.ruler.push('new_rule', formatter)
    })
  }
}
