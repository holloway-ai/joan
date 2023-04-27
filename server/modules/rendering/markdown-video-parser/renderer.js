const blockEmbedPlugin = require("markdown-it-block-embed");
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

// function myRule (state) {
//   const iframeOpen = state.push('iframe_open', 'iframe', 1);
//   iframeOpen.content = '<iframe width="560" height="315" src="https://www.youtube.com/embed/61lVNkvk9AU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>';
//   const iframeClose = state.push('iframe_close', 'iframe', -1);
//   iframeClose.content = '</iframe>';
//   // console.log('state.tokens: ', state.tokens);
// };
//
// function iframeOpenRenderer (tokens, idx, options, env, self) {
//   console.log('idx: ', idx);
//   // console.log('tokens given to renderer', tokens);   
//   const token = tokens[idx];
//   console.log('token: ', token);
//   return '<iframe width="560" height="315" src="https://www.youtube.com/embed/61lVNkvk9AU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>'
// };
//
// function iframeCloseRenderer (tokens, idx, options, env, self) {
//   return '</iframe>';
// };
module.exports = {
  init (mdinst, conf) {
    // mdinst.use(blockEmbedPlugin, { containerClassName: 'video-embed' });
    // const input = "@[youtube](SXHsPKPD_eo)";
    // const output = mdinst.render(input);
    // console.log('output: ', output);
    mdinst.use((md, opts) => {
      // md.block.ruler.before('paragraph', 'my_rule', myRule)
      md.block.ruler.before('paragraph', 'include_last_token', includeLastToken)
      md.block.ruler.before('paragraph', 'time_block', timeBlock)
      md.block.ruler.before('paragraph', 'video', videoBlock)
      // md.renderer.rules.inline = () => 'test';
      // md.renderer.rules.iframe_open = iframeOpenRenderer;
      // md.renderer.rules.iframe_close = iframeCloseRenderer;
    })
  }
}
