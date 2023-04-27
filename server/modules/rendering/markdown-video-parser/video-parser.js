function videoBlock (state, startLine, endLine, silent) {
  const videoBlockMarker = '?'
  const urlFormat = /\[(.*)\]\((.*)\)/;
  let start = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]
  const nextLine = max + 1;

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
  const youtubeUrl = new RegExp('(\\w*'+'youtube.com'+'\\w*)','gi');
  const youtubeUrlShort = new RegExp('(\\w*'+'youtu.be'+'\\w*)','gi');
  // console.log('src', src);
  if (src.match(youtubeUrl) || src.match(youtubeUrlShort)) {
    console.log('is a youtube video!');
    const url = new URL(src);
    const videoUid = src.match(youtubeUrl) ? url.searchParams.get('v') : src.substring(src.lastIndexOf('/') + 1);
    let video = state.push("video", "div", 0);
    video.map = [ startLine, start + 1 ]
    // const iframeContainerOpen = state.push('div_open', 'div', 1);
    const iframeOpen = state.push('iframe_open', 'iframe', 1);
    iframeOpen.attrs = [
      [ 'id', 'presentationVideo' ],
      [ 'width', '560' ],
      [ 'height', '315' ],
      [ 'src', `https://www.youtube.com/embed/${videoUid}` ],
      [ 'frameborder', '2' ],
      [ 'title', 'YouTube video player' ],
      [ 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' ],
      [ 'allowfullscreen', true ],
    ]
    iframeOpen.map = [ startLine, nextLine ];
    const iframeClose = state.push('iframe_close', 'iframe', -1);
    // const iframeContainerClose = state.push('div_close', 'div', -1);
    // console.log('state.tokens: ', state.tokens);
  } else {
    console.log('is not a youtube video');
    const videoType = src.substring(src.lastIndexOf('.') + 1);
    
    const videoOpen = state.push('video_open', 'video', 1)
    videoOpen.attrs = [ [ 'id', 'presentationVideo' ], [ 'controls', true ] ]
    videoOpen.block = true
    
    const source = state.push('source', 'source', 0);
    source.attrs = [ [ 'type', `video/${videoType}` ], [ 'src', src ] ]
    
    const videoClose = state.push('video_close', 'video', -1);
    console.log('state.tokens: ', state.tokens);
  };
};

module.exports = {
  videoBlock
}
