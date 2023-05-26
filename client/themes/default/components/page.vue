<template lang="pug">
  v-app(v-scroll='upBtnScroll', :dark='$vuetify.theme.dark', :class='$vuetify.rtl ? `is-rtl` : `is-ltr`')
    nav-header(v-if='!printView')
    <!-- v-navigation-drawer( -->
    <!--       v-if='navMode !== `NONE` && !printView' -->
    <!--       :class='$vuetify.theme.dark ? `grey darken-4-d4` : `primary`' -->
    <!--       dark -->
    <!--       app -->
    <!--       clipped -->
    <!--       mobile-breakpoint='600' -->
    <!--       :temporary='$vuetify.breakpoint.smAndDown' -->
    <!--       v-model='navShown' -->
    <!--       :right='$vuetify.rtl' -->
    <!--       ) -->
    <!--       vue-scroll(:ops='scrollStyle') -->
    <!--         nav-sidebar-old(:color='$vuetify.theme.dark ? `grey darken-4-d4` : `primary`', :items='sidebarDecoded', :nav-mode='navMode') -->

    v-main(ref='content', style="padding-top: 100px")
      // breadcrumbs
      <!-- v-toolbar.breadcrumbs-container.px-3(height="75" flat, dense) -->
      <!--   v-btn.mr-3( -->
      <!--     small -->
      <!--     icon -->
      <!--     @click='navShown = !navShown' -->
      <!--     ) -->
      <!--     v-icon mdi-menu -->
      <!--   v-breadcrumbs.breadcrumbs-nav.pa-0.ma-0( -->
      <!--     :items='breadcrumbs' -->
      <!--     divider='/' -->
      <!--     ) -->
      <!--     template(slot='item', slot-scope='props') -->
      <!--       v-icon(v-if='props.item.path === "/"', small, @click='goHome') mdi-home -->
      <!--       v-btn.pa-0.ma-0(v-else, :href='props.item.path', small, text) {{props.item.name}} -->
      <!--   template(v-if='!isPublished') -->
      <!--     v-spacer -->
      <!--     .caption.red--text {{$t('common:page.unpublished')}} -->
      <!--     status-indicator.ml-3(negative, pulse) -->
      v-container(fluid, grid-list-xl)
        v-layout(row)

          <!-- toc -->
          v-col.toc(
            v-if='tocPosition !== `off` && $vuetify.breakpoint.lgAndUp'
            :order-xs1='tocPosition !== `right`'
            :order-xs2='tocPosition === `right`'
            lg3
            xl2
            cols="2"
            :style="{'height': `${pageContainerHeight}px`}"
            )
              nav-sidebar(:items='sidebarDecoded', :nav-mode='navMode')
              .toc-header.mb-7 {{$t('common:page.toc')}}
              v-list#toc-contents.pa-0(dense, flat, nav, :class='$vuetify.theme.dark ? `darken-3-d3` : ``')
                template(v-for='(tocItem, tocIdx) in tocDecoded')
                  <!-- v-list-item.pa-0.ma-0(@click='$vuetify.goTo(tocItem.anchor, { ...scrollOpts, container: refs.container.childNodes[0] })') -->
                  v-list-item.pa-0.ma-0(@click='goToContent(tocItem.anchor)')
                    v-list-item-content.pa-0
                      .toc-title-timestamp(ref="tocTitleTimestamps")
                      v-list-item-title {{tocItem.title}}
                  template(v-for='tocSubItem in tocItem.children')
                    v-list-item(@click='goToContent(tocSubItem.anchor)')
                      v-list-item-title.px-1.grey--text(:class='$vuetify.theme.dark ? `text--lighten-1` : `text--darken-1`') {{tocSubItem.title}}

          <!-- contents -->
          v-col.page-col-content.pa-0(
            cols="10"
            )
            v-alert.mb-5(v-if='!isPublished', color='red', outlined, icon='mdi-minus-circle', dense)
              .caption {{$t('common:page.unpublishedWarning')}}
            v-row#page-header-section.py-4(no-gutters, ref='headerRef')
              v-col.page-col-content.is-page-header.pa-0.ma-0(
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
                <!-- v-tooltip(bottom, v-if='isAuthenticated') -->
                <!--   template(v-slot:activator='{ on }') -->
                <!--     v-btn.btn-animate-edit( -->
                <!--       icon -->
                <!--       :href='"/h/" + locale + "/" + path' -->
                <!--       v-on='on' -->
                <!--       x-small -->
                <!--       v-if='hasReadHistoryPermission' -->
                <!--       :aria-label='$t(`common:header.history`)' -->
                <!--       ) -->
                <!--       icon(name='history') -->
                <!--   span {{$t('common:header.history')}} -->
                <!-- span {{ authorName }} -->
                <!-- span {{ updatedAt | moment('DD/MM/YYYY') }} -->
                <!-- v-tooltip(bottom, v-if='commentsPerms.write') -->
                <!--   template(v-slot:activator='{ on }') -->
                <!--     v-btn( -->
                <!--       icon -->
                <!--       tile -->
                <!--       @click='goToComments(true)' -->
                <!--       v-on='on' -->
                <!--       :aria-label='$t(`common:comments.newComment`)' -->
                <!--       ) -->
                <!--       icon(name='comment') -->
                <!--   span {{$t('common:comments.newComment')}} -->

                <!-- header buttons -->

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
            v-row(no-gutters)
              #page-content-container(ref='container', :style="{'height': `${pageContainerHeight}px`}")
                slot(name='contents', @slidesScroll="scrollContent")
              .text-center
                v-snackbar.copiedMsg(v-model="snackbar", :timeout="2000", light, rounded) Copied to clipboard...
                <!-- .comments-container#discussion(v-if='commentsEnabled && commentsPerms.read && !printView') -->
                  <!-- .comments-header -->
                  <!--   v-icon.mr-2(dark) mdi-comment-text-outline -->
                  <!--   span {{$t('common:comments.title')}} -->
              <!--     .comments-main -->
              <!--       slot(name='comments') -->
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
      winWidth: 0
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
    }
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
  mounted () {
    const TOPBAR_HEIGHT = 100;

    const presentationVideo = document.getElementById('presentationVideo');
    if (presentationVideo) {
      const pageHeaderSection = document.getElementById('page-header-section');
      const pageContent = document.getElementById('page-content');
      pageContent.insertBefore(pageHeaderSection, pageContent.firstChild);

      const slides = document.querySelectorAll('.slide');
      const toggleExpandBtn = document.getElementById('toggle-expand-btn');
      slides.forEach(s =>{
        s.addEventListener('click', this.handleSlideClick, { capture: true })
      })
      toggleExpandBtn.addEventListener('click', this.toggleExpand)
      
      const headersAndParagraphs = Array.from(pageContent.querySelectorAll('h2, p'));
      const firstParagraphs = headersAndParagraphs.filter((_, idx) => {
        if (idx === 0) return false;
        if (headersAndParagraphs[idx - 1].tagName === 'H2') {
          return true
        };
      });

      const timestamps = firstParagraphs.map(p => {
        return p.querySelector('span')?.dataset?.start || null;
      });
      // For now timestamps will only be showed if the browser width is greater than 1270, this is to avoid an error that will be fixed when we implement the mobile version
      if (window.innerWidth > 1270) {
        this.$refs.tocTitleTimestamps.forEach((t, idx) => {
          if (timestamps[idx]) {
            const ms = Math.floor(Number(timestamps[idx]) * 1000);
            const timestamp = msToTime(ms);
            const span = document.createElement('span');
            span.innerHTML = timestamp
            t.appendChild(span);
          } else {
            const span = document.createElement('span');
            span.innerHTML = '--';
            t.appendChild(span);
          };
        })
      };
    };

    // set page height
    this.pageContainerHeight = window.innerHeight - TOPBAR_HEIGHT;
    
    const spans = document.querySelectorAll('#page-text span');
    spans.forEach(s => {
      s.addEventListener('dblclick', (e) => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" })
        const slides = Array.from(document.querySelectorAll('.slide'));
        const currentAndPast = slides.filter((s) => Number(s.dataset.start) <= Number(e.target.dataset.start));
        const nearestSlide = currentAndPast[currentAndPast.length - 1];
        const videoContainer = document.getElementById('presentationVideo');
        const start = e.target.dataset.start;

        nearestSlide.scrollIntoView({ behavior: "smooth", block: "center" })
        videoContainer.style.top = nearestSlide.offsetTop + 'px'

        if (videoContainer.children[0].tagName === 'VIDEO') {
          videoContainer.children[0].currentTime = start
          videoContainer.children[0].play()
        };

        if (videoContainer.children[0].tagName === 'IFRAME') {
          const targetTime = Math.round(Number(start));
          const videoSrc = videoContainer.children[0].src;
          const newVideoSrc = new URL(videoSrc);
          newVideoSrc.searchParams.set('start', targetTime);
          newVideoSrc.searchParams.set('autoplay', 1);
          videoContainer.children[0].src = newVideoSrc
        };
      })
    })


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
    // -> Handle anchor links within the page contents
    this.$nextTick(() => {
      const headers = document.querySelectorAll('#page-content h2');
      const anchors = this.$refs.container.querySelectorAll(`a[href^="#"], a[href^="${window.location.href.replace(window.location.hash, '')}#"]`);
      anchors.forEach(el => {
        el.onclick = ev => {
          ev.preventDefault()
          ev.stopPropagation()
          navigator.clipboard.writeText(window.location + ev.currentTarget.hash);
          this.snackbar = true
          el.scrollIntoView({ behavior: "smooth", block: "start" })
          this.$vuetify.goTo(decodeURIComponent(ev.currentTarget.hash), {
            ...this.scrollOpts,
            container: this.$refs.container
          })
          headers.forEach(h => {
            if (h.id !== ev.currentTarget.hash.substring(1)) {
              h.classList.remove('highlighted-on-select')
            } else {
              h.classList.add('highlighted-on-select')
            };
          })
        }
      })
      window.boot.notify('page-ready')
    })
  },
  beforeUnmount() {
    window.removeEventListener('hashchange', () => this.navigateToResult())
  },
  methods: {
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
    navigateToResult () {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, .content'));
      const location = String(window.location);
      const searchResultId = location.substring(location.indexOf('#') + 1);
      elements.forEach(element => {
        if (element.id === searchResultId) {
          element.classList.add('highlighted-on-select')
        } else {
          element.classList.remove('highlighted-on-select')
        };
      })
      this.$vuetify.goTo(decodeURIComponent(window.location.hash), this.scrollOpts)
    },
    handleSlideClick (e) {
      const slideContainer = e.target.parentElement;
      const { start } = slideContainer.dataset;
      const slides = document.querySelectorAll('#slides-content .slide');
      slides.forEach(s => {
        s.classList.remove('selected')
      })

      slideContainer.classList.add('selected')

      if (!start) return; // if there is no data-start attribute, then just do nothing
      const spans = document.querySelectorAll('#page-text span');
      const beforeSelected = Array.from(spans).filter(span => Number(span.dataset.start) <= Number(start));
      const afterSelected = Array.from(spans).filter(span => Number(span.dataset.start) > Number(start));
      const videoContainer = document.getElementById('presentationVideo');
      const selectedSlideTopPosition = e.target.offsetTop;

      if (beforeSelected.length) {
        beforeSelected[beforeSelected.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' })
      };
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      videoContainer.style.top = selectedSlideTopPosition + 'px';

      if (videoContainer.children[0].tagName === 'VIDEO') {
        videoContainer.children[0].currentTime = start
        videoContainer.children[0].play()
      };

      if (videoContainer.children[0].tagName === 'IFRAME') {
        const targetTime = Math.round(Number(e.target.parentElement.dataset.start));
        const videoSrc = videoContainer.children[0].src;
        const newVideoSrc = new URL(videoSrc);
        newVideoSrc.searchParams.set('start', targetTime);
        newVideoSrc.searchParams.set('autoplay', 1);
        videoContainer.children[0].src = newVideoSrc
      };

      spans.forEach(s => { s.classList.remove('highlighted-on-select') });
      beforeSelected[beforeSelected.length - 1].classList.add('highlighted-on-select');
      if (afterSelected.length) {
        afterSelected[0].classList.add('highlighted-on-select');
      };
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
  },
  watch: {
    upBtnShown(_, newValue) {
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
      overflow-y: visible;
      height: 1em;
      font-size: 1.11rem;
      font-weight: 400;

    }
  }
}
.theme--light.v-toolbar.v-sheet {
  background-color: $gray-200;
}
#page-content-container {
  display: flex;
  overflow: hidden;

  & #page-content {
    display: flex;
    flex-direction: column;
    flex: .75;
    height: 100%;
    padding: 0 3em;
    border-left: 1px solid $gray-300;
    border-right: 1px solid $gray-300;


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

      & h2 {
        display: flex;
        font-size: 1.5rem;
        font-weight: 600;
        counter-increment: headerCounter;
        margin-bottom: .5em;

        &::before {
          content: "0" counter(headerCounter);
          font-size: .9em;
          font-weight: 700;
          padding-top: 0.13em;
          margin-right: .8em;
          counter-increment: h2;
          color: $orange;
        }

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

  & #page-slides {
    flex: .25;
    height: 100%;
    padding: 2em 3em 2em 2em;
    display: flex;
    flex-direction: column;
    gap: 1.7em;
    // transition: all .3s ease-in;

    & iframe {
      width: 100%;
      height: 100%;
    }

    & #slides-options {
      #toggle-expand-btn {
        display: flex;
        align-items: center;
        gap: .5em;
      }

      #expand-btn, #restore-btn {
        display: none;
      }

      & #expand-btn.active, & #restore-btn.active {
        display: block;
      }
    }

    & #slides-content {
      position: relative;
      height: 100%;
      overflow: scroll;
      display: flex;
      flex-direction: column;
      gap: 1.7em;
    }

    & .slide {
      opacity: .3;
      cursor: pointer;
      width: 100%;

      & img {
        width: 100%;
      }
    }

    & #presentationVideo {
      position: absolute;
      z-index: 5;

      & video {
        width: 100%;
        // width: calc(100% - 3rem);
      }
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
.page-col-sd {
  margin-top: -90px;
  align-self: flex-start;
  position: sticky;
  top: 64px;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  -ms-overflow-style: none;
}
.page-col-sd::-webkit-scrollbar {
  display: none;
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
