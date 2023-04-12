const { videoBlock } = require('./video-parser');
const { timeBlock } = require('./timestamp-parser');

// this is a workaround to fix the parser not including the token for the last element issue.

// this basically takes the last line with content from the source (state.src) and generate
// a token with it, then it removes that last line from the source to avoid a duplicate line.
function includeLastToken (state, startLine, endLine) {
  let start = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]
  const isTheLastLine = max === state.eMarks[state.eMarks.length - 1];

  if (isTheLastLine) {
    const remainingContent = state.src.substring(0, start - 10);
    const lastLine = state.src.substring(start);
    state.src = remainingContent;

    const paragraphOpen = state.push('paragraph_open', 'p', 1)
    const textLine = state.push('inline', '', 0)
    textLine.content = lastLine;
    textLine.children = []
    const paragraphClose = state.push('paragraph_close', 'p', -1)
  };
};

module.exports = {
  init (mdinst, conf) {
    mdinst.use((md, opts) => {
      md.block.ruler.before('paragraph', 'include_last_token', includeLastToken)
      md.block.ruler.before('paragraph', 'time_block', timeBlock)
      md.block.ruler.before('paragraph', 'video', videoBlock)
    })
  }
}
