function createSlidesOptions (state) {
  const svgAttrs = [
    [ 'width', '10' ],
    [ 'height', '16' ],
    [ 'viewBox', '0 0 10 16' ],
    [ 'fill', 'none' ]
  ]
  const expandSvgOpen = new state.Token('icon_svg_open', 'svg', 1);
  expandSvgOpen.attrs = [
    ...svgAttrs,
    [ 'id', 'expand-btn' ],
    [ 'class', 'active' ]
  ]
  const restoreSvgOpen = new state.Token('icon_svg_open', 'svg', 1);
  restoreSvgOpen.attrs = [
    ...svgAttrs,
    [ 'id', 'restore-btn' ]
  ]
  const svgClose = new state.Token('icon_svg_close', 'svg', -1);
  const slideButtonOpen = new state.Token('slide_button_open', 'button', 1);
  slideButtonOpen.attrs = [ [ 'id', 'toggle-expand-btn' ] ]
  const buttonSpanOpen = new state.Token('button_span_open', 'span', 1);
  const buttonSpanText = new state.Token('text', '');
  buttonSpanText.content = 'Expand';
  const buttonSpanClose = new state.Token('button_span_close', 'span', -1);
  const slideButtonClose = new state.Token('slide_button_close', 'button', -1);

  const expandIconPath = new state.Token('expand_icon_path', 'path', 0);
  expandIconPath.attrs = [
    [ 'd', 'M8.00015 0.585693L0.585938 7.99991L8.00015 15.4141L9.41436 13.9999L3.41436 7.99991L9.41436 1.99991L8.00015 0.585693Z' ], 
    [ 'fill', 'black' ]
  ]

  const restoreIconPath = new state.Token('restore_icon_path', 'path', 0);
  restoreIconPath.attrs = [
    [ 'd', 'M1.99985 15.4143L9.41406 8.00009L1.99985 0.585881L0.585634 2.00009L6.58564 8.00009L0.585635 14.0001L1.99985 15.4143Z' ],
    [ 'fill', 'black' ]
  ]

  return [
    slideButtonOpen,
    expandSvgOpen,
    expandIconPath,
    svgClose,
    restoreSvgOpen,
    restoreIconPath,
    svgClose,
    buttonSpanOpen,
    buttonSpanText,
    buttonSpanClose,
    slideButtonClose
  ]
};

function formatter (state) {
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
  pageSlidesOptionsOpen.attrs = [ [ 'id', 'slides-options' ] ]
  const pageSlidesOptionsClose = new state.Token('div_close', 'div', -1);
  const pageSlidesContentOpen = new state.Token('div_open', 'div', 1);
  pageSlidesContentOpen.attrs = [ [ 'id', 'slides-content' ] ]
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
    ...createSlidesOptions(state),
    pageSlidesOptionsClose,
    pageSlidesContentOpen,
    ...video,
    ...slides,
    pageSlidesContentClose,
    pageSlidesClose
  ];
};

module.exports = {
  formatter
}
