<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const TIME_STAMP_MARK = /\s?{([^}]*(~\d*(?:\.\d+)?)[^}]*)}\s?/g
=======
const TIME_STAMP_MARK = /\s?{([^}]*(~\d*(?:\.\d+)?)[^}]*)}\s?/g;
>>>>>>> 36700c30 (page redesign implementation - wip)
=======
const TIME_STAMP_MARK = /\s?{([^}]*(~\d*(?:\.\d+)?)[^}]*)}\s?/g
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
const TIME_STAMP_MARK = /\s?{([^}]*(~\d*(?:\.\d+)?)[^}]*)}\s?/g
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e

function sanitizeContentElements (arr) {
  return arr.reduce((acc, curr, idx) => {
    const isFirstIndex = idx - 1 === -1
    const sameAsLast = curr === acc[acc.length - 1]
    const emptyString = curr === ''

    // omit empty strings and same values
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    if (isFirstIndex && emptyString) return acc
    if (!isFirstIndex && (emptyString || sameAsLast)) return acc
=======
    if (isFirstIndex && emptyString) return acc;
    if (!isFirstIndex && (emptyString || sameAsLast)) return acc;
>>>>>>> 0ff14912 (page redesign implementation at 80%)
=======
    if (isFirstIndex && emptyString) return acc
    if (!isFirstIndex && (emptyString || sameAsLast)) return acc
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
    if (isFirstIndex && emptyString) return acc
    if (!isFirstIndex && (emptyString || sameAsLast)) return acc
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e

    return [ ...acc, curr ]
  }, []).map(el => {
    if (el.includes('~')) return Number(el.replace('~', ''))
    return el
  })
};

function generateSpans (contents, Token) {
  return contents.reduce((acc, curr, idx) => {
    const isFirst = idx === 0
    const isLast = idx === contents.length - 1
    const isCustomStyle = curr[0] === '{' && curr[curr.length - 1] === '}'

    if (isCustomStyle) return acc

    if (typeof curr === 'number') {
      if (isFirst) {
        const spanOpen = new Token('span_open', 'span', 1)
        spanOpen.attrs = [ [ 'data-end', contents[idx + 2] ], [ 'data-start', curr ] ]

        return [ ...acc, spanOpen ]
      };

      if (isLast) {
        const spanClose = new Token('span_close', 'span', -1)
        return [ ...acc, spanClose ]
      };

      // if the timestamp is between texts
      const spanClose = new Token('span_close', 'span', -1)
      const spanOpen = new Token('span_open', 'span', 1)
      spanOpen.attrs = [ [ 'data-end', contents[idx + 2] ], [ 'data-start', curr ] ]

      return [ ...acc, spanClose, spanOpen ]
    };

    if (typeof curr === 'string') {
      const text = new Token('text', '')
      if (curr.match(/{.*}/)) {
        text.content = curr
      } else {
        text.content = curr + ' '
      };
      return [ ...acc, text ]
    };
  }, [])
};

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
function timeBlock (state, startLine) {
  // this is the default 'paragraph' rule implementation
  let content; let terminate; let i; let l; let token; let oldParentType
  let nextLine = startLine + 1
  let terminatorRules = state.md.block.ruler.getRules('paragraph')
  let endLine = state.lineMax
<<<<<<< HEAD
<<<<<<< HEAD
=======
function getSectionTimestampsOld (src) {
  const TIMESTAMP_MARK_RAW = String.raw`{~([^}]*(?:\d*(?:\.\d+)?)[^}]*)}`;
  const lookahead = `${TIMESTAMP_MARK_RAW}(?=(?:(?!${TIMESTAMP_MARK_RAW})[^])*(?:^##.+|(?![^])))`;;
  const lookbehind = `(?<=^##.+$(?:(?!${TIMESTAMP_MARK_RAW})[^])*)${TIMESTAMP_MARK_RAW}`;
  const sectionTimestamps = new RegExp(`${lookbehind}|${lookahead}`, 'gm');

  return src.matchAll(sectionTimestamps);
};

=======
>>>>>>> 0ff14912 (page redesign implementation at 80%)
function getSectionTimestamps(str) {
  const timestamps = `\n${str}`.split('\n## ')
    .map(x => [...x.matchAll(/\{~(\d|\.)*\}/g)].map(x => x[0]))
    .map(x => [x[0], x.slice(-1)]).flat(2).filter(x => x)
    .map(x => +x.replace(/[\{\}~]/g, ''));

  const groupedTimestamps = timestamps.reduce((acc, curr, idx) => {
    if (idx % 2 === 0) {
      return [ ...acc, { dataStart: curr } ]
    } else {
      const arr = [ ...acc ];
      arr[ acc.length - 1 ].dataEnd = curr
      return arr;
    };
  }, []);

  return groupedTimestamps;
}

function timeBlock (state, startLine) {
  console.log('state: ', state);
  // this is the default 'paragraph' rule implementation
  let content, terminate, i, l, token, oldParentType,
      nextLine = startLine + 1,
      terminatorRules = state.md.block.ruler.getRules('paragraph'),
      endLine = state.lineMax;
=======
>>>>>>> a9c93790 (Render crunsh fix #20)

  oldParentType = state.parentType
  state.parentType = 'paragraph'

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue }

    // Some tags can terminate paragraph without empty line.
    terminate = false
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true
        break
      }
    }
    if (terminate) { break }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim()

  state.line = nextLine

  token = state.push('paragraph_open', 'p', 1)
  token.map = [ startLine, state.line ]

  token = state.push('inline', '', 0)
  token.content = content
  token.map = [ startLine, state.line ]
  token.children = []

  token = state.push('paragraph_close', 'p', -1)

  state.parentType = oldParentType

<<<<<<< HEAD
  // adding token with the title of the page
  
  // const title = state.push('heading_open', 'h1', 1);
  // title.content = state.env.title;
  // state.push('heading_close', 'h1', -1);

  // thumbnail parser

  const sectionTimestamps = getSectionTimestamps(state.src);
  
  state.tokens.forEach((t, idx) => {
    if (t.content.slice(0, 2) === '![') {
      const imgAlt = t.content.slice(t.content.indexOf('[') + 1, t.content.indexOf(']')).trim();
      const imgAltSanitized = imgAlt.toLowerCase().replaceAll(' ', '-');
      const imgSrc = t.content.slice(t.content.indexOf('(') + 1, t.content.indexOf(')'));

      state.tokens[idx - 1].type = 'slide_open';
      state.tokens[idx - 1].tag = 'div';
      state.tokens[idx - 1].attrs = [ [ 'class', 'slide' ], [ 'data-id', imgAltSanitized ] ];
=======
  // adding class to paragraph

  const paragraphs = state.tokens.filter(t => t.type === 'paragraph_open')

  paragraphs.forEach((t, idx) => {
    if (t.type === 'paragraph_open') {
      t.attrs = [ [ 'class', 'content' ], [ 'id', idx ] ]
    };
  })

  // thumbnail parser

  const isVideoPage = state.src.includes('?[video]')
  if (!isVideoPage) return true

  state.tokens.forEach((t, idx) => {
    if (t.content.slice(0, 2) === '![') {
      const haveTimestamp = t.content.match(TIME_STAMP_MARK)
      const imgAlt = t.content.slice(t.content.indexOf('[') + 1, haveTimestamp ? t.content.indexOf('{') : t.content.indexOf(']')).trim()
      const imgAltSanitized = imgAlt.toLowerCase().replace('/ /g', '-')
      const imgSrc = t.content.slice(t.content.indexOf('(') + 1, t.content.indexOf(')'))
      const slideTimestamp = t.content.slice(t.content.indexOf('~') + 1, t.content.indexOf('}'))

      state.tokens[idx - 1].type = 'slide_open'
      state.tokens[idx - 1].tag = 'div'
      state.tokens[idx - 1].attrs = [
        [ 'class', 'slide' ],
        [ 'data-id', imgAltSanitized ],
        ...haveTimestamp ? [ [ 'data-start', slideTimestamp ] ] : []
      ]
>>>>>>> a9c93790 (Render crunsh fix #20)

      t.type = 'slide_content'
      t.tag = 'img'
      t.nesting = 0
      t.attrs = [ [ 'alt', imgAlt ], [ 'src', imgSrc ] ]

      state.tokens[idx + 1].type = 'slide_close'
      state.tokens[idx + 1].tag = 'div'
    };
  })

  state.tokens.filter(t => t.type === 'slide_open').forEach((t, idx) => {
    t.attrs = [
      ...t.attrs,
      [ 'data-start', sectionTimestamps[idx].dataStart ], 
      [ 'data-end', sectionTimestamps[idx].dataEnd ] 
    ]
  })

  // timestamp parser
<<<<<<< HEAD
  
  state.tokens.forEach((t, idx) => {
    if (idx === 0) return;
>>>>>>> 36700c30 (page redesign implementation - wip)
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e

  oldParentType = state.parentType
  state.parentType = 'paragraph'

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue }

    // Some tags can terminate paragraph without empty line.
    terminate = false
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true
        break
      }
    }
    if (terminate) { break }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim()

  state.line = nextLine

  token = state.push('paragraph_open', 'p', 1)
  token.map = [ startLine, state.line ]

  token = state.push('inline', '', 0)
  token.content = content
  token.map = [ startLine, state.line ]
  token.children = []

  token = state.push('paragraph_close', 'p', -1)

  state.parentType = oldParentType

  // adding class to paragraph

  const paragraphs = state.tokens.filter(t => t.type === 'paragraph_open')

  paragraphs.forEach((t, idx) => {
    if (t.type === 'paragraph_open') {
      t.attrs = [ [ 'class', 'content' ], [ 'id', idx ] ]
    };
  })

  // thumbnail parser

  const isVideoPage = state.src.includes('?[video]')
  if (!isVideoPage) return true

  state.tokens.forEach((t, idx) => {
    if (t.content.slice(0, 2) === '![') {
<<<<<<< HEAD
      const haveTimestamp = t.content.match(TIME_STAMP_MARK)
      const imgAlt = t.content.slice(t.content.indexOf('[') + 1, haveTimestamp ? t.content.indexOf('{') : t.content.indexOf(']')).trim()
      const imgAltSanitized = imgAlt.toLowerCase().replace('/ /g', '-')
      const imgSrc = t.content.slice(t.content.indexOf('(') + 1, t.content.indexOf(')'))
      const slideTimestamp = t.content.slice(t.content.indexOf('~') + 1, t.content.indexOf('}'))

      state.tokens[idx - 1].type = 'slide_open'
      state.tokens[idx - 1].tag = 'div'
      state.tokens[idx - 1].attrs = [
        [ 'class', 'slide' ],
        [ 'data-id', imgAltSanitized ],
=======
      const haveTimestamp = t.content.match(TIME_STAMP_MARK);
      const imgAlt = t.content.slice(t.content.indexOf('[') + 1, haveTimestamp ? t.content.indexOf('{') : t.content.indexOf(']')).trim();
      // const imgAltSanitized = imgAlt.toLowerCase().replaceAll(' ', '-');
      const imgSrc = t.content.slice(t.content.indexOf('(') + 1, t.content.indexOf(')'));
      const slideTimestamp = t.content.slice(t.content.indexOf('~') + 1, t.content.indexOf('}'));

      state.tokens[idx - 1].type = 'slide_open';
      state.tokens[idx - 1].tag = 'div';
      state.tokens[idx - 1].attrs = [
        [ 'class', 'slide' ], 
        // [ 'data-id', imgAltSanitized ],
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
        ...haveTimestamp ? [ [ 'data-start', slideTimestamp ] ] : []
      ]

      t.type = 'slide_content'
      t.tag = 'img'
      t.nesting = 0
      t.attrs = [ [ 'alt', imgAlt ], [ 'src', imgSrc ] ]

      state.tokens[idx + 1].type = 'slide_close'
      state.tokens[idx + 1].tag = 'div'
    };
  })

  // timestamp parser

<<<<<<< HEAD
=======

>>>>>>> a9c93790 (Render crunsh fix #20)
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
  state.tokens.forEach((t, idx) => {
    if (idx === 0) return

    const isParagraphContent = state.tokens[idx - 1].tag === 'p' && state.tokens[idx + 1].tag === 'p' && t.content.length

    if (isParagraphContent) {
      const lines = t.content.split('\n')

      lines.forEach(line => {
        const lineIsEmpty = line === ''
        const lineHasCurlyBrace = line.indexOf('{') !== -1
        const lineHasTilde = line.indexOf('~') !== -1

        if (lineIsEmpty || !lineHasCurlyBrace || !lineHasTilde) return

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        const contentElementsRaw = line.split(TIME_STAMP_MARK)
        const contentElements = sanitizeContentElements(contentElementsRaw)
        const newTokens = generateSpans(contentElements, state.Token)

        t.children = newTokens
        t.content = ''
      })
    };
  })
=======
        const contentElementsRaw = line.split(TIME_STAMP_MARK);
        const contentElements = sanitizeContentElements(contentElementsRaw);
        const newTokens = generateSpans(contentElements, state.Token);
=======
        const contentElementsRaw = line.split(TIME_STAMP_MARK)
        const contentElements = sanitizeContentElements(contentElementsRaw)
        const newTokens = generateSpans(contentElements, state.Token)
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
        const contentElementsRaw = line.split(TIME_STAMP_MARK)
        const contentElements = sanitizeContentElements(contentElementsRaw)
        const newTokens = generateSpans(contentElements, state.Token)
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e

        t.children = newTokens
        t.content = ''
      })
    };
<<<<<<< HEAD
<<<<<<< HEAD
  });
>>>>>>> 36700c30 (page redesign implementation - wip)
=======
  })
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
  })
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e

  // video parser

  const videoBlockMarker = '?'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const urlFormat = /\[(.*)\]\((.*)\)/
=======
  const urlFormat = /\[(.*)\]\((.*)\)/;
>>>>>>> 36700c30 (page redesign implementation - wip)
=======
  const urlFormat = /\[(.*)\]\((.*)\)/
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
  const urlFormat = /\[(.*)\]\((.*)\)/
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
  let start = state.bMarks[startLine] + state.tShift[startLine]
  let max = state.eMarks[startLine]

  // remove the original vid]eo url ?[]() from the token content, so it don't show in the render
  state.tokens.forEach((t, idx) => {
    if (t.content[0] === videoBlockMarker) {
      t.type = 'videoblock_content'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
      t.content = ''

      state.tokens[idx - 1].type = 'videoblock_open'
      state.tokens[idx + 1].type = 'videoblock_close'
<<<<<<< HEAD
=======
      t.content = '';

      state.tokens[idx - 1].type = 'videoblock_open';
      state.tokens[idx + 1].type = 'videoblock_close';
>>>>>>> 36700c30 (page redesign implementation - wip)
=======
      t.content = ''

      state.tokens[idx - 1].type = 'videoblock_open'
      state.tokens[idx + 1].type = 'videoblock_close'
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
    };
  })

  if (state.src[start] !== videoBlockMarker) { return true };
  if (!state.src.slice(start + 1, max).match(urlFormat)) { return true };

  // if the last two conditions passed then this is a video block

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
  const src = state.src.slice(state.src.indexOf('(') + 1, state.src.indexOf(')'))
  const youtubeUrl = new RegExp('(\\w*' + 'youtube.com' + '\\w*)', 'gi')
  const youtubeUrlShort = new RegExp('(\\w*' + 'youtu.be' + '\\w*)', 'gi')

  if (src.match(youtubeUrl) || src.match(youtubeUrlShort)) {
    console.log('is a youtube video!')
    const url = new URL(src)
    const videoUid = src.match(youtubeUrl) ? url.searchParams.get('v') : src.substring(src.lastIndexOf('/') + 1)

<<<<<<< HEAD
    const video = state.push('video_open', 'div', 1)
    video.attrs = [
      [ 'id', 'presentationVideo' ],
      [ 'data-source', `https://www.youtube.com/embed/${videoUid}` ],
      [ 'data-vendor', 'youtube' ]
=======
    const videoContainer = state.push('video_container_open', 'div', 1);
    videoContainer.attrs = [
      [ 'id', 'presentationVideo' ], 
    ]

    const video = state.push('video_open', 'iframe', 1);
    video.attrs = [
      [ 'src', `https://www.youtube.com/embed/${videoUid}` ],
      [ 'frameborder', '2' ],
      [ 'title', 'YouTube video player' ],
      [ 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' ],
      [ 'allowfullscreen', true ],
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
    ]
    state.push('video_close', 'iframe', -1)
    state.push('video_container_close', 'div', -1)
  } else {
    console.log('is not a youtube video')
    const videoType = src.substring(src.lastIndexOf('.') + 1)

    const videoContainer = state.push('video_container_open', 'div', 1)
    videoContainer.attrs = [ [ 'id', 'presentationVideo' ] ]

    const video = state.push('video_open', 'video', 1)
    video.attrs = [ [ 'controls', 'true' ] ]

    const source = state.push('video_source', 'source', 0)
    source.attrs = [
      [ 'src', src ],
      [ 'type', `video/${videoType}` ]
    ]
    state.push('video_close', 'video', -1)
<<<<<<< HEAD
=======
  const src = state.src.slice(state.src.indexOf('(') + 1, state.src.indexOf(')'));
  const youtubeUrl = new RegExp('(\\w*'+'youtube.com'+'\\w*)','gi');
  const youtubeUrlShort = new RegExp('(\\w*'+'youtu.be'+'\\w*)','gi');
=======
  const src = state.src.slice(state.src.indexOf('(') + 1, state.src.indexOf(')'))
  const youtubeUrl = new RegExp('(\\w*' + 'youtube.com' + '\\w*)', 'gi')
  const youtubeUrlShort = new RegExp('(\\w*' + 'youtu.be' + '\\w*)', 'gi')
>>>>>>> a9c93790 (Render crunsh fix #20)

  if (src.match(youtubeUrl) || src.match(youtubeUrlShort)) {
    console.log('is a youtube video!')
    const url = new URL(src)
    const videoUid = src.match(youtubeUrl) ? url.searchParams.get('v') : src.substring(src.lastIndexOf('/') + 1)

    const video = state.push('video_open', 'div', 1)
    video.attrs = [
      [ 'id', 'presentationVideo' ],
      [ 'data-source', `https://www.youtube.com/embed/${videoUid}` ],
      [ 'data-vendor', 'youtube' ]
    ]
    state.push('video_close', 'div', -1)
  } else {
    console.log('is not a youtube video')
    const videoType = src.substring(src.lastIndexOf('.') + 1)

    const videoContainer = state.push('video_container_open', 'div', 1)
    videoContainer.attrs = [ [ 'id', 'presentationVideo' ] ]

    const video = state.push('video_open', 'video', 1)
    video.attrs = [ [ 'controls', 'true' ] ]

    const source = state.push('video_source', 'source', 0)
    source.attrs = [
      [ 'src', src ],
      [ 'type', `video/${videoType}` ]
    ]
    state.push('video_close', 'video', -1)

>>>>>>> 36700c30 (page redesign implementation - wip)
=======
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
    state.push('video_container_close', 'div', -1)
  };

  // console.log('state: ', state);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  return true
=======
  return true;
>>>>>>> 36700c30 (page redesign implementation - wip)
=======
  return true
>>>>>>> a9c93790 (Render crunsh fix #20)
=======
  return true
>>>>>>> 06be72a7a4dc71d42ae312b952a1f2e1a7d4a10e
};

module.exports = {
  timeBlock,
  sanitizeContentElements,
  generateSpans
}
