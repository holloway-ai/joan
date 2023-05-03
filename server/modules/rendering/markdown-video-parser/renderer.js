const { videoBlock } = require('./video-parser');
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
        const pageSlidersOpen = new state.Token('div_open', 'div', 1);
        pageSlidersOpen.attrs = [ [ 'id', 'page-sliders' ] ]
        const pageSlidersClose = new state.Token('div_close', 'div', -1);

        // slides
        const slides = state.tokens.reduce((acc, curr, idx) => {
          if (curr.content.slice(0, 2) === '![') {
            return [ ...acc, [ state.tokens[idx - 1], curr, state.tokens[idx + 1] ] ];
          };
          return acc;
        }, []).flat();


        state.tokens = [
          pageContentOpen,
          pageTitleContainerOpen,
          pageTitleContainerClose,
          pageTextOpen,
          ...pageText,
          pageTextClose,
          pageContentClose,
          pageSlidersOpen,
          ...state.tokens.filter(t => t.type.includes('video_')),
          ...slides,
          pageSlidersClose
        ];
        // console.log('=============', state.tokens);
      })
      // console.log('CORE', md.core.ruler.__rules__);
    })
  }
}
