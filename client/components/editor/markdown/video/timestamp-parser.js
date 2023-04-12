const TIME_STAMP = /\s?{([^}]*(~\d*(?:\.\d+)?)[^}]*)}\s?/g;

function sanitizeContentElements (arr) {
  return arr.reduce((acc, curr, idx) => {
    const isFirstIndex = idx - 1 === -1;
    const sameAsLast = curr === acc[acc.length - 1];
    const emptyString = curr === '';

    // omit empty strings and same values
    if (isFirstIndex && emptyString) return acc;
    if (!isFirstIndex && (emptyString || sameAsLast)) return acc;

    return [ ...acc, curr ]
  }, []).map(el => {
    if (el.includes('~')) return Number(el.replace('~', ''));
    return el;
  });
};

function generateSpans (contents, Token) {
  return contents.reduce((acc, curr, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === contents.length - 1;

    if (typeof curr === 'number') {

      if (isFirst) {
        const spanOpen = new Token('span_open', 'span', 1)
        spanOpen.attrs = [ [ 'data-end', contents[idx + 2] ], [ 'data-start', curr ] ]

        return [ ...acc, spanOpen ];
      };

      if (isLast) {
        const spanClose = new Token('span_close', 'span', -1)
        return [ ...acc, spanClose ];
      };
      
      // if the timestamp is between texts
      const spanClose = new Token('span_close', 'span', -1);
      const spanOpen = new Token('span_open', 'span', 1);
      spanOpen.attrs = [ [ 'data-end', contents[idx + 2] ], [ 'data-start', curr ] ]

      return [ ...acc, spanClose, spanOpen ];
    };

    if (typeof curr === 'string') {
      const text = new Token('text', '')
      if (curr.match(/{.*}/)) {
        text.content = curr
      } else {
        text.content = curr + ' ';
      }; 
      return [ ...acc, text ];
    };
  }, []);
};

function timeBlock (state, start, end, silent) {
  state.tokens.forEach((t, idx) => {
    if (idx === 0) return;

    const isParagraphContent = state.tokens[idx - 1].tag === 'p' && state.tokens[idx + 1].tag === 'p' && t.content.length;

    if (isParagraphContent) {
      const lines = t.content.split('\n');

      lines.forEach(line => {
        const lineIsEmpty = line === '';
        const lineHasCurlyBrace = line.indexOf('{') !== -1;
        const lineHasTilde = line.indexOf('~') !== -1;

        if (lineIsEmpty || !lineHasCurlyBrace || !lineHasTilde) return;

        const contentElementsRaw = line.split(TIME_STAMP);
        const contentElements = sanitizeContentElements(contentElementsRaw);
        const newTokens = generateSpans(contentElements, state.Token);

        t.children = newTokens;
        t.content = '';

      });
    };
  });
};

module.exports = {
  timeBlock
}
