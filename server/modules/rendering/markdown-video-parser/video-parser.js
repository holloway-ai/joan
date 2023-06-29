function videoBlock (state, startLine, endLine, silent) {
  const videoBlockMarker = '?'
  const urlFormat = /\[(.*)\]\((.*)\)/;
  let start = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]

  // remove the original video url ?[]() from the token content, so it don't show in the render
  state.tokens.forEach(t => {
    if (t.content[0] === videoBlockMarker) {
      t.content = '';
    };
  })
  if (state.src[start] !== videoBlockMarker) { return false };
  if (!state.src.slice(start + 1, max).match(urlFormat)) { return false };

  // if the last two conditions passed then this is a video block

  const src = state.src.slice(state.src.indexOf('(') + 1, state.src.indexOf(')'));
  const videoType = src.substring(src.lastIndexOf('.') + 1);
  
  const videoOpen = state.push('video_open', 'video', 1)
  videoOpen.attrs = [ [ 'id', 'presentationVideo' ], [ 'controls', true ] ]
  videoOpen.block = true
  
  const source = state.push('source', 'source', 0);
  source.attrs = [ [ 'type', `video/${videoType}` ], [ 'src', src ] ]
  
  const videoClose = state.push('video_close', 'video', -1);
};

module.exports = {
  videoBlock
}
