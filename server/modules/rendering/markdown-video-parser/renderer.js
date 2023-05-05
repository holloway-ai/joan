const { timeBlock } = require('./timestamp-parser');

module.exports = {
  init (mdinst, conf) {
    mdinst.use((md, opts) => {
      md.block.ruler.at('paragraph', timeBlock)

      md.core.ruler.push('new_rule', (state) => {
        // page content
        const pageContentOpen = new state.Token('div_open', 'div', 1);
        pageContentOpen.attrs = [ [ 'id', 'page-content' ] ]

        const pageTitleContainerOpen = new state.Token('div_open', 'div', 1);
        pageTitleContainerOpen.attrs = [ [ 'class', 'title-container' ] ]
        const pageTitleContainerClose = new state.Token('div_close', 'div', -1);

        const pageTextOpen = new state.Token('div_open', 'div', 1);
        pageTextOpen.attrs = [ [ 'id', 'page-text' ] ]
        const pageText = state.tokens.filter(t => !(t.type.includes('video') || t.type.includes('slide')));
        const pageTextClose = new state.Token('div_close', 'div', -1);

        const pageContentClose = new state.Token('div_close', 'div', -1);


        // page slides
        const pageSlidesOpen = new state.Token('div_open', 'div', 1);
        pageSlidesOpen.attrs = [ [ 'id', 'page-slides' ] ]
        const pageSlidesClose = new state.Token('div_close', 'div', -1);

        // slides
        const slides = state.tokens.reduce((acc, curr, idx) => {
          if (curr.content.slice(0, 2) === '![') {
            return [ ...acc, [ state.tokens[idx - 1], curr, state.tokens[idx + 1] ] ];
          };
          return acc;
        }, []).flat();

        // video
        const video = state.tokens.filter(t => t.type.includes('video_'));

        const pageSlidesOptionsOpen = new state.Token('div_open', 'div', 1);
        const pageSlidesOptionsClose = new state.Token('div_close', 'div', -1);
        const pageSlidesContentOpen = new state.Token('div_open', 'div', 1);
        const pageSlidesContentClose = new state.Token('div_close', 'div', -1);

        state.tokens = [
          pageContentOpen,
          pageTitleContainerOpen,
          pageTitleContainerClose,
          pageTextOpen,
          ...pageText,
          pageTextClose,
          pageContentClose,
          pageSlidesOpen,
          pageSlidesOptionsOpen,
          pageSlidesOptionsClose,
          pageSlidesContentOpen,
          ...video,
          ...slides,
          pageSlidesContentClose,
          pageSlidesClose
        ];
        // console.log('=============', state.tokens);
      })
      // console.log('CORE', md.core.ruler.__rules__);
    })
  }
}
