<template lang="pug">
  v-app.overflow-hidden.fill-height(:dark='$vuetify.theme.dark', :class='$vuetify.rtl ? `is-rtl` : `is-ltr`')
    nav-header(v-if='!printView')
    v-main.overflow-hidden.fill-height(ref='content')
      v-row.no-gutters.overflow-y-hidden.fill-height
        <!-- toc -->
        v-col.toc.pa-4.col-2.overflow-y-hidden.fill-height#toc-col(
          v-if='tocPosition !== `off` && $vuetify.breakpoint.lgAndUp'
          :order-xs1='tocPosition !== `right`'
          :order-xs2='tocPosition === `right`'
          ref="tocRef"
          )
            nav-sidebar(:items='sidebarDecoded', :nav-mode='navMode')
            .toc-header.mb-7 {{$t('common:page.toc')}}
            v-list#toc-contents.pa-0.overflow-y-auto(dense, flat, nav, :subheader = 'hasTimestamps', :two-line="hasTimestamps" :class='$vuetify.theme.dark ? `darken-3-d3` : ``')
              v-list-item.pa-0.ma-0( v-for='header in headers', :key='header.prefix')
                v-avatar {{header.prefix}}
                v-list-item-content
                  v-list-item-title  {{header.header}}
                  v-list-item-subtitle( v-if="header.start_time") {{header.start_time}}

        <!-- contents -->
        v-col.col-7.pa-0.overflow-y-hidden.fill-height#content-col
          v-alert.mb-5(v-if='!isPublished', color='red', outlined, icon='mdi-minus-circle', dense)
            .caption {{$t('common:page.unpublishedWarning')}}
          v-row.pa-4#page-header-section(no-gutters, ref='headerRef')
            v-col.is-page-header.ps-3.ma-0(
              :xl='tocPosition === `right` ? 10 : false'
              :lg='tocPosition === `right` ? 9 : false'
              style='margin-top: auto; margin-bottom: auto;'
              )
              .page-header-headings
                h1 {{title}}
                .caption.grey--text.text--darken-1 {{description}}
              .page-edit-shortcuts(
                v-if='editShortcutsObj.editMenuBar'
                :class='tocPosition === `right` ? `is-right` : ``'
                )
                v-btn(
                  v-if='editShortcutsObj.editMenuBtn'
                  @click='pageEdit'
                  depressed
                  small
                  )
                  v-icon.mr-2(small) mdi-pencil
                  icon(name='edit-page')
                  span.text-none {{$t(`common:actions.edit`)}}
                v-btn(
                  v-if='editShortcutsObj.editMenuExternalBtn'
                  :href='editMenuExternalUrl'
                  target='_blank'
                  depressed
                  small
                  )
                  v-icon.mr-2(small) {{ editShortcutsObj.editMenuExternalIcon }}
                  span.text-none {{$t(`common:page.editExternal`, { name: editShortcutsObj.editMenuExternalName })}}
            v-col.page-info.pa-0
              v-btn(
                v-if='hasWritePagesPermission'
                icon,
                tile,
                :disabled='!hasWritePagesPermission'
                :aria-label='$t(`common:page.editPage`)'
                @click="pageEdit"
                )
                icon(name="edit-page")
              <!-- new page menu -->
              v-menu(offset-y, bottom, open-on-hover, content-class="header-menu")
                template(v-slot:activator='{ on: menu }')
                  v-btn(icon, tile, v-on='menu', :aria-label='$t(`common:page.share`)')
                    icon(name='new-page')
                v-list
                  v-list-item(v-for="(editor, idx) in editorOptions", :key="idx", link, @click='pageNew(editor.id)')
                    v-list-item-title {{ editor.name }}
              v-menu(offset-y, bottom, min-width='300', content-class="header-menu")
                template(v-slot:activator='{ on: menu }')
                  v-tooltip(bottom)
                    template(v-slot:activator='{ on: tooltip }')
                      v-btn(icon, tile, v-on='{ ...menu, ...tooltip }')
                        icon(name='share')
                    span {{$t('common:page.share')}}
                social-sharing(
                  :url='pageUrl'
                  :title='title'
                  :description='description'
                )
              v-menu(offset-y, bottom, open-on-hover, content-class="header-menu")
                template(v-slot:activator='{ on: menu }')
                  v-btn(icon, tile, v-on='menu', :aria-label='$t(`common:page.share`)')
                    icon(name='more')
                v-list
                  v-list-item(link, @click='pageHistory')
                    v-list-item-icon
                      v-icon(size='20') mdi-history
                    v-list-item-title {{$t('common:header.history')}}
                  v-list-item(link, @click='pageSource')
                    v-list-item-icon
                      v-icon(size='20') mdi-code-tags
                    v-list-item-title
                      span {{$t('common:header.viewSource')}}
                  v-list-item(link, @click='pageConvert', small)
                    v-list-item-icon
                      v-icon(size='20') mdi-lightning-bolt
                    v-list-item-title
                      span {{$t('common:header.convert')}}
                  v-list-item(link, @click='pageDuplicate')
                    v-list-item-icon
                      v-icon(size='20') mdi-content-duplicate
                    v-list-item-title
                      span {{$t('common:header.duplicate')}}
                  v-list-item(link, @click='pageMove')
                    v-list-item-icon
                      v-icon(size='20') mdi-content-save-move-outline
                    v-list-item-title
                      span {{$t('common:header.move')}}
                  v-list-item(link, @click='pageDelete')
                    v-list-item-icon
                      v-icon(size='20') mdi-trash-can-outline
                    v-list-item-title
                      span {{$t('common:header.delete')}}
          v-row.no-gutters.overflow-y-auto.fill-height
            #page-content-container(ref='container')
              slot(name='contents')
            .text-center
              v-snackbar.copiedMsg(v-model="snackbar", :timeout="2000", light, rounded) Copied to clipboard...
              <!-- .comments-container#discussion(v-if='commentsEnabled && commentsPerms.read && !printView') -->
                <!-- .comments-header -->
                <!--   v-icon.mr-2(dark) mdi-comment-text-outline -->
                <!--   span {{$t('common:comments.title')}} -->
            <!--     .comments-main -->
            <!--       slot(name='comments') -->
        <!-- media -->
        v-col.col-3.pa-0.overflow-y-hidden.fill-height#media-col(ref='mediaCol')
          v-row.no-gutters.overflow-y-hidden
            v-btn(
              @click='currentPlayTime+=60'
              depressed
              small
              )
              v-icon.mr-2(small) mdi-chevron-left
              span.text-none {{$t(`common:actions.edit`)}}
            #media-ancher(ref='mediaAncher' v-on:wheel="onMediaWheel")
              v-sheet(id = "media-container"  )
          v-row.no-gutters.fill-height.overflow-y-hidden
            v-col.col-12.pa-3.overflow-y-auto.fill-height.slides_container(
                ref="slidesContainer"
                v-on:scroll="onSlidesScroll"
                v-on:scrollend="onSlidesScrollEnd"
                v-on:wheel="onSlidesWheel"
              )

              template( width="100%"  v-for="(slide, slideIdx) in slides" )
                v-sheet.slide(
                    :key = "slide.number"
                    v-on:click="onSlideClick(slide.number)",
                    :class="slide.type"
                  )
                  v-responsive( width="100%",:aspect-ratio="16/9" )
                    v-img.slide_img(:src="slide.src" width="100%")

                  p {{slide.startTime}}

    search-results
    page-selector(mode='create', v-model='newPageModal', :open-handler='pageNewCreate', :locale='locale')
</template>

<script>
import { StatusIndicator } from 'vue-status-indicator'
import Tabset from './tabset.vue'
import NavSidebar from './nav-sidebar.vue'
import Prism from 'prismjs'
import mermaid from 'mermaid'
import { get, sync } from 'vuex-pathify'
import _ from 'lodash'
import ClipboardJS from 'clipboard'
import Vue from 'vue'
import Icon from '../../../components/icon'
import { msToTime } from '../../../helpers/utils'
import { scaleTime } from 'd3'

Vue.component('Tabset', Tabset)
Prism.plugins.autoloader.languages_path = '/_assets/js/prism/'
Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
  'remove-initial-line-feed': true,
  'tabs-to-spaces': 2
})
Prism.plugins.toolbar.registerButton('copy-to-clipboard', (env) => {
  let linkCopy = document.createElement('button')
  linkCopy.textContent = 'Copy'
  const clip = new ClipboardJS(linkCopy, {
    text: () => { return env.code }
  })
  clip.on('success', () => {
    linkCopy.textContent = 'Copied!'
    resetClipboardText()
  })
  clip.on('error', () => {
    linkCopy.textContent = 'Press Ctrl+C to copy'
    resetClipboardText()
  })
  return linkCopy
  function resetClipboardText() {
    setTimeout(() => {
      linkCopy.textContent = 'Copy'
    }, 5000)
  }
})
export default {
  components: {
    NavSidebar,
    StatusIndicator,
    Icon
  },
  props: {
    pageId: {
      type: Number,
      default: 0
    },
    locale: {
      type: String,
      default: 'en'
    },
    path: {
      type: String,
      default: 'home'
    },
    title: {
      type: String,
      default: 'Untitled Page'
    },
    description: {
      type: String,
      default: ''
    },
    createdAt: {
      type: String,
      default: ''
    },
    updatedAt: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => ([])
    },
    authorName: {
      type: String,
      default: 'Unknown'
    },
    authorId: {
      type: Number,
      default: 0
    },
    editor: {
      type: String,
      default: ''
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    toc: {
      type: String,
      default: ''
    },
    sidebar: {
      type: String,
      default: ''
    },
    navMode: {
      type: String,
      default: 'MIXED'
    },
    commentsEnabled: {
      type: Boolean,
      default: false
    },
    effectivePermissions: {
      type: String,
      default: ''
    },
    commentsExternal: {
      type: Boolean,
      default: false
    },
    editShortcuts: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      route: window.location,
      navShown: true,
      navExpanded: false,
      upBtnShown: false,
      showEditMenu: false,
      snackbar: false,
      slidesExpanded: false,
      pageContainerHeight: 0,
      selectedSlideTopPosition: 0,
      lastSelectedSlide: null,
      newPageModal: false,
      ignoreScrollEvent: false,
      mainScrolled: null,
      slidesSectionScrollTop: 0,
      timeScales: {},
      editorOptions: [
        {
          name: 'Markdown',
          id: 'markdown'
        },
        {
          name: 'HTML Code',
          id: 'code'
        },
        {
          name: 'Visual Editor',
          id: 'ckeditor'
        },
        {
          name: 'ASCIIDoc',
          id: 'asciidoc'
        },
        {
          name: 'Video Markdown',
          id: 'video'
        }
      ],
      selectedEditor: '',
      scrollOpts: {
        duration: 1150,
        offset: 50,
        easing: 'easeInOutCubic'
      },
      scrollStyle: {
        vuescroll: {},
        scrollPanel: {
          initialScrollX: 0.01, // fix scrollbar not disappearing on load
          scrollingX: false,
          speed: 50
        },
        rail: {
          gutterOfEnds: '2px'
        },
        bar: {
          onlyShowBarOnScroll: false,
          background: '#42A5F5',
          hoverStyle: {
            background: '#64B5F6'
          }
        }
      },
      winWidth: 0,
      headers: [],
      slides: [
       { src: null, title: '', number: 0, start: -1.0, type: 'service', startTime: "00:00:00.000", end: 100000 }
      ],
      videoSrc: null,
      videoSrcType: 'video/mp4',
      mediaObject: null,
      currentPlayTime: null,
      hasTimestamps: false,
    }
  },
  computed: {
    mode: get('page/mode'),
    isAuthenticated: get('user/authenticated'),
    hasNewPagePermission () {
      return this.hasAdminPermission || _.intersection(this.permissions, ['write:pages']).length > 0
    },
    commentsCount: get('page/commentsCount'),
    commentsPerms: get('page/effectivePermissions@comments'),
    editShortcutsObj: get('page/editShortcuts'),
    currentEditor: sync('editor/editor'),
    rating: {
      get () {
        return 3.5
      },
      set (val) {
      }
    },
    breadcrumbs() {
      return [{ path: '/', name: 'Home' }].concat(_.reduce(this.path.split('/'), (result, value, key) => {
        result.push({
          path: _.get(_.last(result), 'path', `/${this.locale}`) + `/${value}`,
          name: value
        })
        return result
      }, []))
    },
    pageUrl () { return window.location.href },
    upBtnPosition () {
      if (this.$vuetify.breakpoint.mdAndUp) {
        return this.$vuetify.rtl ? `right: 235px;` : `left: 235px;`
      } else {
        return this.$vuetify.rtl ? `right: 65px;` : `left: 65px;`
      }
    },
    sidebarDecoded () {
      return JSON.parse(Buffer.from(this.sidebar, 'base64').toString())
    },
    tocDecoded () {
      return JSON.parse(Buffer.from(this.toc, 'base64').toString())
    },
    tocPosition: get('site/tocPosition'),
    hasAdminPermission: get('page/effectivePermissions@system.manage'),
    hasWritePagesPermission: get('page/effectivePermissions@pages.write'),
    hasManagePagesPermission: get('page/effectivePermissions@pages.manage'),
    hasDeletePagesPermission: get('page/effectivePermissions@pages.delete'),
    hasReadSourcePermission: get('page/effectivePermissions@source.read'),
    hasReadHistoryPermission: get('page/effectivePermissions@history.read'),
    hasAnyPagePermissions () {
      return this.hasAdminPermission || this.hasWritePagesPermission || this.hasManagePagesPermission ||
        this.hasDeletePagesPermission || this.hasReadSourcePermission || this.hasReadHistoryPermission
    },
    printView: sync('site/printView'),
    editMenuExternalUrl () {
      if (this.editShortcutsObj.editMenuBar && this.editShortcutsObj.editMenuExternalBtn) {
        return this.editShortcutsObj.editMenuExternalUrl.replace('{filename}', this.filename)
      } else {
        return ''
      }
    },
    activeSlideIndex () {
      return _.findIndex(this.slides, (slide) => {
        return slide.start <= this.currentPlayTime && slide.end > this.currentPlayTime
      })
    },
  },
  created() {
    this.$store.set('page/authorId', this.authorId)
    this.$store.set('page/authorName', this.authorName)
    this.$store.set('page/createdAt', this.createdAt)
    this.$store.set('page/description', this.description)
    this.$store.set('page/isPublished', this.isPublished)
    this.$store.set('page/id', this.pageId)
    this.$store.set('page/locale', this.locale)
    this.$store.set('page/path', this.path)
    this.$store.set('page/tags', this.tags)
    this.$store.set('page/title', this.title)
    this.$store.set('page/editor', this.editor)
    this.$store.set('page/updatedAt', this.updatedAt)
    if (this.effectivePermissions) {
      this.$store.set('page/effectivePermissions', JSON.parse(Buffer.from(this.effectivePermissions, 'base64').toString()))
    }
    if (this.editShortcuts) {
      this.$store.set('page/editShortcuts', JSON.parse(Buffer.from(this.editShortcuts, 'base64').toString()))
    }
    this.$store.set('page/mode', 'view')
  },
  beforeMount () {
    // console.log(Array.from(document.querySelectorAll('#page-text h2, #page-text [data-start]')));
  },
  updated () {
    if (this.currentPlayTime === null) {
      const meadiaContainer = document.getElementById('media-container')
      const slideElements = document.querySelectorAll('.slide')
      const activeSlide = slideElements[0]

      activeSlide.classList.add('active')

      const activePos = (
        activeSlide.getBoundingClientRect().top
        + this.$refs.slidesContainer.scrollTop
        - this.$refs.mediaCol.getBoundingClientRect().top
      )
      meadiaContainer.style.top = `${activePos}px`
      this.setPlayTime(0.0)
    }
  },
  mounted() {
    const TOPBAR_HEIGHT = 100;

    const presentationVideo = document.getElementById('presentationVideo');
    const highlights = document.querySelectorAll("[data-start]");

    const headersAndStarts = Array.from(document.querySelectorAll('#page-text h2, #page-text [data-start]'));
    let headers = [];
    let maxTime = 0.0;
    for (let i = 0; i < headersAndStarts.length; i++) {
      let timestamp = null
      if (headersAndStarts[i].tagName === 'H2') {
        const h2 = headersAndStarts[i];
        if (i < headersAndStarts.length - 1) {
          timestamp = headersAndStarts[i + 1].dataset?.start;
          if (timestamp) {
            this.hasTimestamps = true;
            maxTime = Math.max(maxTime, Number(timestamp));
          }
        }
        const prefix = (headers.length + 1).toString().padStart(2, "0");

        headers.push({
          header: h2.textContent,
          start: timestamp ? Number(timestamp): null,
          start_time: timestamp ? new Date(Number(timestamp) * 1000).toISOString().slice(11, -1) : '',
          id: h2.id,
          end: null,
          prefix: prefix,
        })
        let element = document.createElement('span');
        element.textContent = prefix;
        element.classList.add('header-number');
        h2.prepend(element);
      } else {
        if (headers.length > 0) {
          const end = headersAndStarts[i].dataset?.end;
          if (end) {
            headers[headers.length - 1].end = Number(end);
            maxTime = Math.max(maxTime, Number(end));
          }
        }
      }
    }

    //console.log(headers);



    const spans = document.querySelectorAll('#page-text span');
    spans.forEach(s => { s.addEventListener('dblclick', e => { this.handleTextDblClick(e) }) })

    const slidesBlock = document.getElementById('page-slides');
    const slidesSource = Array.from(slidesBlock.querySelectorAll('.slide')).sort(
      (a, b)=>{return Number(a.dataset?.start) - Number(b.dataset?.start)});
    let slides = [{
      src: null,
      title: '',
      number: 0,
      start: -1.0,
      type: 'service',
      startTime: "00:00:00.000",
      end: null
    }];
    for (let i = 0; i < slidesSource.length; i++) {
      const slide = slidesSource[i]
      const slideImg = slidesSource[i].querySelector('img');
      if (!slideImg) continue;

      let timestamp = slide.dataset?.start;
      timestamp = timestamp ? Number(timestamp) : null;
      if (timestamp) {
        this.hasTimestamps = true;
        maxTime = Math.max(maxTime, Number(timestamp));
        if (slides.length>0) slides[slides.length-1].end = timestamp;
      }
      slides.push({
        src: slideImg.src,
        title: slide.textContent,
        number: slides.length ,
        start: timestamp,
        type: 'image',
        startTime: timestamp ? new Date(timestamp * 1000).toISOString().slice(11, -1) : '',
        end: null,
      })
    }

    slides[slides.length - 1].end = maxTime;

    if (slides.length > 1) slides.push({
        src: null,
        title: '',
        number: slides.length,
        start: maxTime,
        type: 'service',
        startTime: new Date(maxTime * 1000).toISOString().slice(11, -1),
        end: 1000000
    });
    this.slides = slides;

    if (headers.length > 0) {
      headers[headers.length - 1].end = maxTime;
      // console.log(headers);
      this.headers = headers;
    }

    if (presentationVideo) {
      const video = presentationVideo.querySelector('video')
      if (video) {
        video.addEventListener('timeupdate', (ev) => {
          this.currentPlayTime = ev.target.currentTime;
        })

      }

      const mediaContainer = document.getElementById('media-container');
      if (mediaContainer) {
        mediaContainer.prepend(...presentationVideo.children)
      }

    }


    // mediaContainer.prepend(...presentationVideo.children)

    console.log(presentationVideo);

    slidesBlock.parentElement.removeChild(slidesBlock);
    //ugly hack to make it work
    //window.setTimeout(()=>this.onSlideClick(0), 1000);

    //"page-slides"

/*     const pageText = document.getElementById('page-text');
    const slidesContent = document.getElementById('slides-content');
    const slides = document.querySelectorAll('.slide');
    if (slides.length == 0) {
      //slidesContent.style.display = 'none';
      const pageContentSection = document.getElementById('page-content');
      const pageSlidesSection = document.getElementById('page-slides');
      pageContentSection.style.flex = '1 1'
      pageSlidesSection.style.display = 'none'

    } */




    if (this.$vuetify.theme.dark) {
      this.scrollStyle.bar.background = '#424242'

    }
    // -> Check side navigation visibility
    this.handleSideNavVisibility()
    window.addEventListener('resize', _.debounce(() => {
      this.handleSideNavVisibility()
    }, 500))
    // -> Highlight Code Blocks
    Prism.highlightAllUnder(this.$refs.container)
    // -> Render Mermaid diagrams
    mermaid.mermaidAPI.initialize({
      startOnLoad: true,
      theme: this.$vuetify.theme.dark ? `dark` : `default`
    })
    // -> Handle anchor scrolling
    if (window.location.hash && window.location.hash.length > 1) {
      if (document.readyState === 'complete') {
        this.$nextTick(() => {
          this.navigateToResult();
        })
      } else {
        window.addEventListener('load', () => {
          this.navigateToResult();
          window.addEventListener('hashchange', () => this.navigateToResult())
        })
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('hashchange', () => this.navigateToResult())
  },
  methods: {
    getActiveSlideElement () {
      const activeSlide = document.querySelector('.slide.active')
      //console.log(activeSlide);
      return activeSlide

    },
    startScrollingWithSlide(slide) {
      if (!slide) return
      this.$refs.slidesContainer.classList.add('scrolling')
      const meadiaContainer = document.getElementById('media-container')
      meadiaContainer.style.top = 0
      //meadiaContainer.parentElement.removeChild(meadiaContainer)
      slide.prepend(meadiaContainer)
      console.log("scroll ");

    },
    onMediaWheel(e) {
      console.log("media wheel");
      // return this.$refs.slidesContainer.dispatchEvent(new WheelEvent(e.type, e))
    },
    onSlidesWheel(e) {
      console.log("slides wheel");
      this.autoScroll = false
    },
    onSlidesScroll(e) {
      if (this.autoScroll) {
        console.log("auto scroll");
        return
      }
      this.startScrollingWithSlide(document.querySelector('.slide.active'))

    },
    onSlidesScrollEnd(e) {
      this.autoScroll = false;
      if (!this.$refs.slidesContainer.classList.contains ('scrolling')) return
      this.$refs.slidesContainer.classList.remove('scrolling')
      const meadiaContainer = document.getElementById('media-container')
      const activeSlide = document.querySelector('.slide.active')
      const activeTop = (
        activeSlide.getBoundingClientRect().top
        - this.$refs.mediaCol.getBoundingClientRect().top
      )
      //const activeTop = 20;
      console.log("activeTop",activeTop);
      console.log("activeBottom",activeTop+ activeSlide.getBoundingClientRect().height);
      meadiaContainer.style.top = `${activeTop}px`
      this.$refs.mediaAncher.prepend(meadiaContainer)
      this.userScroll = true;
      console.log("scroll end");
    },
    onSlideClick(newActiveSlideIdx) {
      //this.autoScroll = true;
      console.log("slide click", newActiveSlideIdx);
      const meadiaContainer = document.getElementById('media-container')
      const slideElements = document.querySelectorAll('.slide')
      console.log(slideElements);
      const activeSlide = slideElements[newActiveSlideIdx]
      const firstSlide = slideElements[0]
      const lastSlide = slideElements[slideElements.length - 1]

      const topPos = (
        firstSlide.getBoundingClientRect().top
        + this.$refs.slidesContainer.scrollTop
        - this.$refs.mediaCol.getBoundingClientRect().top
      )

      let activePos = (
        activeSlide.getBoundingClientRect().top
        //+ this.$refs.slidesContainer.scrollTop
        - this.$refs.mediaCol.getBoundingClientRect().top
      )
      const bottomPos = (
        this.$refs.slidesContainer.getBoundingClientRect().height
        - this.$refs.slidesContainer.scrollHeight
        + lastSlide.getBoundingClientRect().bottom
        + this.$refs.slidesContainer.scrollTop
        - activeSlide.getBoundingClientRect().height
        - this.$refs.mediaCol.getBoundingClientRect().top
      )
      activePos =Math.min( Math.max( activePos,topPos), bottomPos )
      // this.$refs.slidesContainer.getBoundingClientRect().bottom- ((this.$refs.slidesContainer.scrollHeight + this.$refs.slidesContainer.getBoundingClientRect().top) - (lastSlide.getBoundingClientRect().bottom + this.$refs.slidesContainer.scrollTop)) - activeSlide.getBoundingClientRect().height - this.$refs.mediaCol.getBoundingClientRect().top
      console.log("Pos",topPos, activePos, bottomPos);
      meadiaContainer.style.top = `${activePos}px`
      const newTime = this.slides[newActiveSlideIdx].start;
      this.setPlayTime(newTime)
      console.log("click-finished");

    },
    setPlayTime(startTime) {
      const meadiaContainer = document.getElementById('media-container')

      if (meadiaContainer.children[0].tagName === 'VIDEO') {
        const player = meadiaContainer.children[0]
        player.currentTime = startTime
        this.currentPlayTime = startTime; //?
        player.play()

      } else if (meadiaContainer.children[0].tagName === 'IFRAME') {
        //Youtube??
        const targetTime = startTime;
        const videoSrc = meadiaContainer.children[0].src;
        const newVideoSrc = new URL(videoSrc);
        newVideoSrc.searchParams.set('start', targetTime);
        newVideoSrc.searchParams.set('autoplay', 1);
        meadiaContainer.children[0].src = newVideoSrc
      };
      this.currentPlayTime = startTime;
    },
    goHome () {
      window.location.assign('/')
    },
    toggleNavigation () {
      this.navOpen = !this.navOpen
    },
    upBtnScroll () {
      const scrollOffset = window.pageYOffset || document.documentElement.scrollTop
      this.upBtnShown = scrollOffset > window.innerHeight * 0.33
    },
    print () {
      if (this.printView) {
        this.printView = false
      } else {
        this.printView = true
        this.$nextTick(() => {
          window.print()
        })
      }
    },
    pageEdit () {
      this.$root.$emit('pageEdit')
    },
    pageHistory () {
      this.$root.$emit('pageHistory')
    },
    pageSource () {
      this.$root.$emit('pageSource')
    },
    pageConvert () {
      this.$root.$emit('pageConvert')
    },
    pageDuplicate () {
      this.$root.$emit('pageDuplicate')
    },
    pageMove () {
      this.$root.$emit('pageMove')
    },
    pageDelete () {
      this.$root.$emit('pageDelete')
    },
    handleSideNavVisibility () {
      if (window.innerWidth === this.winWidth) { return }
      this.winWidth = window.innerWidth
      // if (this.$vuetify.breakpoint.mdAndUp) {
      //   this.navShown = true
      // } else {
      //   this.navShown = false
      // }
    },
    goToComments (focusNewComment = false) {
      this.$vuetify.goTo('#discussion', this.scrollOpts)
      if (focusNewComment) {
        document.querySelector('#discussion-new').focus()
      }
    },
    navigateToResult() {

/*       const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .content'));
      const location = String(window.location);
      const searchResultId = location.substring(location.indexOf('#') + 1);
      elements.forEach(element => {
        if (element.id === searchResultId) {
          element.classList.add('highlighted-on-select')
        } else {
          element.classList.remove('highlighted-on-select')
        };
      })
      this.$vuetify.goTo(decodeURIComponent(window.location.hash), this.scrollOpts) */
    },
    toggleExpand() {
      this.slidesExpanded = !this.slidesExpanded
    },
    goToContent (contentHash) {
      const headers = document.querySelectorAll('#page-text h2');
      const selectedContentRef = document.getElementById(contentHash.substring(1));
      selectedContentRef.scrollIntoView({ behavior: "smooth", block: "start" })

      headers.forEach((h) => {
        if (h.id !== contentHash.substring(1)) {
          h.classList.remove('highlighted-on-select')
        } else {
          h.classList.add('highlighted-on-select')
        };
      })

    },
    pageNew (editorId) {
      this.newPageModal = true
      this.selectedEditor = editorId
    },
    pageNewCreate ({ path, locale }) {
      window.location.assign(`/e/${locale}/${path}?editor=${this.selectedEditor}`)
    },
    getScrollPercentage (element) {
      return element.scrollTop / (element.scrollHeight - element.offsetHeight);
    },

    highlightCurrentText(video, highlights) {
      const { currentTime } = video;
      highlights.forEach(highlight => {
        const start = parseFloat(highlight.dataset.start);
        const end = parseFloat(highlight.dataset.end);

        if (currentTime >= start && currentTime <= end) {
          highlight.classList.add("highlighted");
        } else {
          highlight.classList.remove("highlighted");
        }
      });
    },
    handleTextDblClick (e) {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" })
      const slides = Array.from(document.querySelectorAll('.slide'));
      const currentAndPast = slides.filter((s) => Number(s.dataset.start) <= Number(e.target.dataset.start));
      const nearestSlide = currentAndPast[currentAndPast.length - 1];
      const start = e.target.dataset.start;
      // const spans = document.querySelectorAll('#page-text span');
      // spans.forEach(s => s.classList.remove('highlighted-on-select'))
      // e.target.classList.add('highlighted-on-select')

      nearestSlide.scrollIntoView({ behavior: "smooth", block: "center" })
      presentationVideo.style.top = nearestSlide.offsetTop + 'px'

      if (presentationVideo.children[0].tagName === 'VIDEO') {
        presentationVideo.children[0].currentTime = start
        presentationVideo.children[0].play()
      };

      if (presentationVideo.children[0].tagName === 'IFRAME') {
        const targetTime = Math.round(Number(start));
        const videoSrc = presentationVideo.children[0].src;
        const newVideoSrc = new URL(videoSrc);
        newVideoSrc.searchParams.set('start', targetTime);
        newVideoSrc.searchParams.set('autoplay', 1);
        presentationVideo.children[0].src = newVideoSrc
      };
    },
    handleVideoOverflow() {
      /*
      const presentationVideo = document.getElementById('presentationVideo');
      const presentationVideoBox = presentationVideo.getBoundingClientRect();
      const slidesContent = document.getElementById('slides-content');
      const slidesContentBox = slidesContent.getBoundingClientRect();

      // console.log('presentationVideo boundingClientRect: ', presentationVideoBox);
      // console.log('slidesContent boundingClientRect: ', slidesContentBox);

      const scrollDifference = this.slidesSectionScrollTop - slidesContent.scrollTop
      // console.log('scrollDifference: ', scrollDifference);

      // scrolling down
      if (scrollDifference > 0 && presentationVideoBox.bottom > slidesContentBox.bottom) {
        // console.log('video is overflowing bottom');
        presentationVideo.style.top = parseInt(presentationVideo.style.top) - scrollDifference + 'px'
      };

      // scrolling up
      if (scrollDifference < 0 && presentationVideoBox.top < slidesContentBox.top) {
        // console.log('video is overflowing top');
        presentationVideo.style.top = parseInt(presentationVideo.style.top.length ? presentationVideo.style.top : 0) - scrollDifference + 'px'
      };

      this.slidesSectionScrollTop = slidesContent.scrollTop
      */
    },
    printValues () {
      const slides = document.querySelectorAll('#slides-content .slide');
    }
  },
  watch: {
    activeSlideIndex(newValue, oldValue) {

      const meadiaContainer = document.getElementById('media-container')
      const rect = meadiaContainer.getBoundingClientRect()

      console.log(`slides: ${oldValue} => ${newValue}` );
      console.log(this.slides[newValue].startTime);

      const container = this.$refs.slidesContainer
      const slideElements = container.querySelectorAll('.slide')
      console.log(slideElements);
      const activeSlide = slideElements[newValue]
      const oldSlide = slideElements[oldValue]
      if (oldSlide) {
        oldSlide.classList.remove('active')
      }

      if (activeSlide) {
        console.log(activeSlide.textContent);
        activeSlide.classList.add('active')
        const scrollTo = (
          activeSlide.getBoundingClientRect().top
          - meadiaContainer.getBoundingClientRect().top
          + container.scrollTop
        )
        console.log(scrollTo);

        if (container.scrollHeight - Math.round(scrollTo) < container.clientHeight) {

          const activePos = (
            container.getBoundingClientRect().height
            - container.scrollHeight
            + activeSlide.getBoundingClientRect().top
            + container.scrollTop
            - this.$refs.mediaCol.getBoundingClientRect().top
          )
          meadiaContainer.style.top = `${activePos}px`
          console.log('scroll to bottom');

        }

        this.$refs.slidesContainer.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        })
        this.autoScroll = true
      } else {
        console.log('no active');
      }
      console.log("endSlideIndex");
    },
    currentPlayTime(newValue, oldValue) {
      const spans = document.querySelectorAll('#page-text span').forEach(s => {
        s.classList.remove('highlighted')
        if (s.dataset?.start <= newValue && s.dataset?.end >= newValue) {
          s.classList.add('highlighted')
        };
      });



    },
    upBtnShown(_, newValue) {
      /*
      if (newValue) {
        const paragraphs = Array.from(document.querySelectorAll('.text-container p'));
        const location = String(window.location);
        const pid = location.substring(location.indexOf('#'));
        paragraphs.forEach(p => {
          if (p.id === pid) {
            Array.from(p.children).forEach(child => child.classList.add('highlighted-on-select'))
          } else {
            Array.from(p.children).forEach(child => child.classList.remove('highlighted-on-select'))
          };
        })
      };
      */
    },
    slidesExpanded (newValue, oldValue) {
      const expandBtn = document.getElementById('expand-btn');
      const restoreBtn = document.getElementById('restore-btn');
      const toggleBtnText = document.querySelector('#toggle-expand-btn span');
      const pageContentSection = document.getElementById('page-content');
      const pageSlidesSection = document.getElementById('page-slides');
      const selectedSlide = document.querySelector('#slides-content .selected');

      if (newValue) {
        expandBtn.classList.remove('active')
        restoreBtn.classList.add('active')
        pageSlidesSection.classList.add('expanded')
        toggleBtnText.innerHTML = 'Restore'
        pageContentSection.style.display = 'none'
        pageSlidesSection.style.flex = '1 1'
      } else {
        expandBtn.classList.add('active')
        restoreBtn.classList.remove('active')
        pageSlidesSection.classList.remove('expanded')
        toggleBtnText.innerHTML = 'Expand'
        pageContentSection.style.display = 'flex'
        pageSlidesSection.style.flex = '0.25 1'
      };

      const videoContainer = document.getElementById('presentationVideo');
      if (selectedSlide) {
        videoContainer.style.top = selectedSlide.offsetTop + 'px';
        selectedSlide.scrollIntoView({ behavior: "smooth", block: "center" })
      };
    }
  },
}
</script>

<style lang="scss">
@import '../../../scss/joan-styles.scss';
html, body,#root, #app{margin: 0; height: 100%; overflow: hidden}

.v-navigation-drawer {
  z-index: 999999;
}
path{
  fill: black;
}
.toc {
  display: flex;
  flex-direction: column;
  padding: 1em 3em;
  overflow: scroll;

  & .toc-header {
    color: black;
    font-size: 1.11rem;
    font-weight: 600;
    border-bottom: 1px solid $gray-300;
    padding: 1em 0 1em 0;
  }


  & .v-list#toc-contents {
    display: flex;
    flex-direction: column;
    gap: 3em;
    counter-set: toc-counter;
  }

  & #toc-contents .v-list-item {
    min-height: 0px;

    & .toc-title-timestamp {
      display: flex;
      margin: 0 0 1.5em 0;

      & span {
        &::before {
          content: '·';
          margin-right: .5em;
        }
      }

      &::before {
        counter-increment: toc-counter;
        content: "0" counter(toc-counter);
        margin-right: .5em;
        color: black;
        font-weight: 600;
      }
    }

    & .v-list-item__title {
      overflow-x: hidden;
      // overflow-y: visible;
      height: 1em;
      font-size: 1.11rem;
      font-weight: 400;

    }
  }
}
.theme--light.v-toolbar.v-sheet {
  background-color: $gray-200;
}
#toc-col {
  border-right: 1px solid $gray-300;
}

#content-col {
    flex-direction: column;
    display: flex;
}
#page-content-container {
  display: flex;
  overflow: hidden;

  & #page-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    padding: 0 3em;



    & #page-text {
      margin-top: 2em;
      height: 100%;
      overflow-y: scroll;

      & p {
        line-height: 1.55;
      }

      & p + p {
        margin: 0 0 0.4em 0;
      }

      & * + h2 {
        margin-top: 1.3em;
      }
      & .header-number {
          font-weight: 700;
          margin-right: .6em;
          color: $orange;
      }

      & h2 {
        display: flex;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: .5em;
        & .toc-anchor {
          display: flex;
          align-items: center;
          margin-left: .6em;

          & path{
            fill: $gray-400;
          }
        }
      }

      & h2:hover .toc-anchor path {
        fill: black;
      }
      & .highlighted {
        background-color: $light-orange;
      }
      & .highlighted-on-select {
        animation-name: fade;
        animation-duration: 5s
      }
      @keyframes fade {
        from {
          background-color: $light-orange;
        }
        to {
          background-color: transparent
        }
      }
    }
  }

  & #page-slides.expanded {
    padding: 2em 13em 2em 13em;
  }



}
#media-col {
  border-left: 1px solid $gray-300;
  position: relative;
  padding: 2em 3em 2em 2em;
  display: flex;
  flex-direction: column;

  .slides_container {
    display: flex;
    flex-direction: column;
    gap: 1.7em;
    .service{
      display: none;
      &.active{
        display: block;
      }
    }
    .slide{
      position: relative;
      opacity: .6;
      &.active{
        opacity: 1;
        position: sticky;
        top: 0px;
        bottom: 0px;
        z-index: 100;

      }
      .slide_img{
        width: 100%;
      }
    }
    &.scrolling{
      .slide{
        opacity: 1;
        &.active{
          opacity: .3;
          #media-container {
              position: absolute;
              z-index: 110;
              left: 0;
              width: 100%;
              pointer-events: none;
              }
        }
      }
    }
  }
  #media-container {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 110;
      width: 100%;
      pointer-events: none;
        & iframe {
          width: 100%;
          height: 100%;
        }
        & video {
          width: 100%;
            // width: calc(100% - 3rem);
        }
      }
}





.breadcrumbs-nav {
  .v-btn {
    min-width: 0;
    &__content {
      text-transform: none;
    }
  }
  .v-breadcrumbs__divider:nth-child(2n) {
    padding: 0 6px;
  }
  .v-breadcrumbs__divider:nth-child(2) {
    padding: 0 6px 0 12px;
  }
}

#page-header-section {
  padding: 2em 0;
  border-bottom: 1px solid $gray-300;

  .v-speed-dial button {
    padding: 0;
    box-shadow: none;
    min-width: 36px;
    background-color: white;
  }

  & .is-page-header {
    display: flex;
    align-items: center;
  }
  .page-header-headings {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: auto 0;

    & h1 {
      font-size: 2.24rem;
      font-weight: 600;
      margin: auto 0;
    }

    & .description {
      font-size: .9rem;
    }
  }
  .page-edit-shortcuts {
    position: absolute;
    bottom: -33px;
    right: 10px;
    .v-btn {
      border-right: 1px solid #DDD !important;
      border-bottom: 1px solid #DDD !important;
      border-radius: 0;
      color: #777;
      background-color: #FFF !important;
      @at-root .theme--dark & {
        background-color: #222 !important;
        border-right-color: #444 !important;
        border-bottom-color: #444 !important;
        color: #CCC;
      }
      .v-icon {
        color: mc('blue', '700');
      }
      &:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
      }
      &:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }
  & .v-menu__content {
    box-shadow: none !important;
  }
  & > .page-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1em;
    color: black;

  }
}
.copiedMsg .v-snack__wrapper {
  max-width: 500px;
}
.copiedMsg .theme--light.v-sheet {
  display: flex;
  justify-content: center;
}
.copiedMsg .v-sheet.v-snack__wrapper:not(.v-sheet--outlined) {
  box-shadow: none;
  border: 1px solid $gray-700 !important;
  min-width: 0px;
  margin-bottom: 30px;
}
.copiedMsg .v-snack__content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .7em;
}
.copiedMsg .theme--light.v-sheet {
  background-color: white;
}
.header-menu {
  box-shadow: none;
  border: 1px solid $gray-700;
}
</style>
