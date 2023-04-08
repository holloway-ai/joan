<template lang="pug">
  v-app(v-scroll='upBtnScroll', :dark='$vuetify.theme.dark', :class='$vuetify.rtl ? `is-rtl` : `is-ltr`')
    nav-header(v-if='!printView')
    v-navigation-drawer(
      v-if='navMode !== `NONE` && !printView'
      :class='$vuetify.theme.dark ? `grey darken-4-d4` : `primary`'
      dark
      app
      clipped
      :temporary='true'
      v-model='navShown'
      :right='$vuetify.rtl'
      )
      vue-scroll(:ops='scrollStyle')
        nav-sidebar(:color='$vuetify.theme.dark ? `grey darken-4-d4` : `primary`', :items='sidebarDecoded', :nav-mode='navMode')

    v-main(ref='content')
      template
        v-toolbar.breadcrumbs-container.px-3(:color='$vuetify.theme.dark ? `grey darken-4-d3` : `grey lighten-3`', flat, dense, v-if='$vuetify.breakpoint.smAndUp')
          v-btn.mr-3(
            small
            icon
            @click='navShown = !navShown'
            )
            v-icon mdi-menu
          v-breadcrumbs.breadcrumbs-nav.pl-0(
            :items='breadcrumbs'
            divider='/'
            )
            template(slot='item', slot-scope='props')
              v-icon.ma-0.pa-0(v-if='props.item.path === "/"', small, @click='goHome') mdi-home
              v-btn.ma-0.pa-0(v-else, :href='props.item.path', small, text) {{props.item.name}}
          template(v-if='!isPublished')
            v-spacer
            .caption.red--text {{$t('common:page.unpublished')}}
            status-indicator.ml-3(negative, pulse)
      v-container.pa-0.page-container(fluid, grid-list-xl, :style="{'height': `${pageContainerHeight}px`}")
        <!-- v-row(no-gutters) -->
        v-layout(row)
          v-col.page-toc-section.px-15.pt-12(
            v-if='tocPosition !== `off` && $vuetify.breakpoint.lgAndUp'
            :order-xs1='tocPosition !== `right`'
            :order-xs2='tocPosition === `right`'
            lg3
            xl2
            cols="2"
            )
            .page-toc-header.mb-7 {{$t('common:page.toc')}}
            v-list.page-toc-section.pa-0(dense, flat, nav, :class='$vuetify.theme.dark ? `darken-3-d3` : ``')
              template(v-for='(tocItem, tocIdx) in tocDecoded')
                <!-- v-list-item.page-toc-section.ma-0(@click='$vuetify.goTo(tocItem.anchor, scrollOpts)') -->
                v-list-item.page-toc-section.ma-0(@click='$vuetify.goTo(tocItem.anchor, scrollOpts)')
                <!-- v-list-item.page-toc-section.ma-0(@click='handleTocNavigation(tocItem)') -->
                  <!-- v-icon(color='grey', small) {{ $vuetify.rtl ? `mdi-chevron-left` : `mdi-chevron-right` }} -->
                  v-list-item-title {{tocItem.title}}
                template(v-for='tocSubItem in tocItem.children')
                  v-list-item.page-toc-section(@click='$vuetify.goTo(tocSubItem.anchor, scrollOpts)')
                    v-icon.px-3(color='grey lighten-1', small) {{ $vuetify.rtl ? `mdi-chevron-left` : `mdi-chevron-right` }}
                    v-list-item-title.px-3.caption.grey--text(:class='$vuetify.theme.dark ? `text--lighten-1` : `text--darken-1`') {{tocSubItem.title}}
          v-col.px-0.ma-0(cols="10")
            v-row.page-header-section.px-10(no-gutters, ref="headerRef")
              v-col.page-col-content.is-page-header(
                :xl='tocPosition === `right` ? 10 : false'
                :lg='tocPosition === `right` ? 9 : false'
                style='margin-top: auto; margin-bottom: auto;'
                )
                .page-header-headings.py-4
                  .page-header-headings-text
                    h1.font-weight-bold {{title}}
                    span.description {{description}}
                  .page-info
                    v-tooltip(bottom, v-if='isAuthenticated')
                      template(v-slot:activator='{ on }')
                        v-btn.btn-animate-edit(
                          icon
                          :href='"/h/" + locale + "/" + path'
                          v-on='on'
                          x-small
                          v-if='hasReadHistoryPermission'
                          :aria-label='$t(`common:header.history`)'
                          )
                          icon(name='history', height="18")
                      span {{$t('common:header.history')}}
                    span {{ authorName }}
                    span {{ updatedAt | moment('DD/MM/YYYY') }}
                    v-tooltip(bottom, v-if='commentsPerms.write')
                      template(v-slot:activator='{ on }')
                        v-btn(
                          icon
                          tile
                          @click='goToComments(true)'
                          v-on='on'
                          :aria-label='$t(`common:comments.newComment`)'
                          )
                          icon(name='comment', height="18")
                      span {{$t('common:comments.newComment')}}
                    v-menu(offset-y, bottom, min-width='300')
                      template(v-slot:activator='{ on: menu }')
                        v-tooltip(bottom)
                          template(v-slot:activator='{ on: tooltip }')
                            v-btn(icon, tile, v-on='{ ...menu, ...tooltip }', :aria-label='$t(`common:page.share`)'): icon(name='share', height="18")
                          span {{$t('common:page.share')}}
                      social-sharing(
                        :url='pageUrl'
                        :title='title'
                        :description='description'
                      )

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
            v-row.page-col-content(no-gutters)
              v-col.is-page-content.px-10(cols="9", :style="{'height': `${pageContainerHeight}px`}")
                v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasAnyPagePermissions && editShortcutsObj.editFab')
                  template(v-slot:activator='{ on: onEditActivator }')
                    v-speed-dial(
                      v-model='pageEditFab'
                      direction='top'
                      open-on-hover
                      transition='scale-transition'
                      bottom
                      :right='!$vuetify.rtl'
                      :left='$vuetify.rtl'
                      fixed
                      dark
                      )
                      template(v-slot:activator)
                        v-btn.btn-animate-edit(
                          fab
                          color='primary'
                          v-model='pageEditFab'
                          @click='pageEdit'
                          v-on='onEditActivator'
                          :disabled='!hasWritePagesPermission'
                          :aria-label='$t(`common:page.editPage`)'
                          )
                          v-icon mdi-pencil
                      v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasReadHistoryPermission')
                        template(v-slot:activator='{ on }')
                          v-btn(
                            fab
                            small
                            color='white'
                            light
                            v-on='on'
                            @click='pageHistory'
                            )
                            v-icon(size='20') mdi-history
                        span {{$t('common:header.history')}}
                      v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasReadSourcePermission')
                        template(v-slot:activator='{ on }')
                          v-btn(
                            fab
                            color='white'
                            light
                            v-on='on'
                            @click='pageSource'
                            )
                            v-icon(size='20') mdi-code-tags
                        span {{$t('common:header.viewSource')}}
                      v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasWritePagesPermission')
                        template(v-slot:activator='{ on }')
                          v-btn(
                            fab
                            small
                            color='white'
                            light
                            v-on='on'
                            @click='pageConvert'
                            )
                            v-icon(size='20') mdi-lightning-bolt
                        span {{$t('common:header.convert')}}
                      v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasWritePagesPermission')
                        template(v-slot:activator='{ on }')
                          v-btn(
                            fab
                            small
                            color='white'
                            light
                            v-on='on'
                            @click='pageDuplicate'
                            )
                            v-icon(size='20') mdi-content-duplicate
                        span {{$t('common:header.duplicate')}}
                      v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasManagePagesPermission')
                        template(v-slot:activator='{ on }')
                          v-btn(
                            fab
                            small
                            color='white'
                            light
                            v-on='on'
                            @click='pageMove'
                            )
                            v-icon(size='20') mdi-content-save-move-outline
                        span {{$t('common:header.move')}}
                      v-tooltip(:right='$vuetify.rtl', :left='!$vuetify.rtl', v-if='hasDeletePagesPermission')
                        template(v-slot:activator='{ on }')
                          v-btn(
                            fab
                            dark
                            small
                            color='red'
                            v-on='on'
                            @click='pageDelete'
                            )
                            v-icon(size='20') mdi-trash-can-outline
                        span {{$t('common:header.delete')}}
                  span {{$t('common:page.editPage')}}
                v-alert.mb-5(v-if='!isPublished', color='red', outlined, icon='mdi-minus-circle', dense)
                  .caption {{$t('common:page.unpublishedWarning')}}
                .contents(ref='container')
                  slot(name='contents', ref='contentRef')
                v-row(no-gutters)
                  .comments-container#discussion(v-if='commentsEnabled && commentsPerms.read && !printView')
                    .comments-header
                      v-icon.mr-2(dark) mdi-comment-text-outline
                      span {{$t('common:comments.title')}}
                    .comments-main
                      slot(name='comments')
              v-col.pr-15.py-7.ma-0.is-page-timestamps(cols="3", :style="{'height': `${pageContainerHeight}px`}")
                video#presentationVideo(controls, ref="video", :style="{ order: (videoPos || 1) }")
                  source(:src="videoSrc || ''")
                template(v-for='(timestamp, idx) in timestamps')
                  div(v-if='idx === 0' @click="handleSlideClick", :style="{ order: idx + 1, width: '0px', marginTop: '-1.7em' }", ref='slides')
                    v-img(:src="timestamp.url")
                  div(v-else @click="handleSlideClick", :style="{ order: idx + 1 }", ref='slides')
                    v-img(:src="timestamp.url")
    <!-- nav-footer -->
    <!-- notify -->
    <!-- search-results -->
    <!-- v-fab-transition -->
    <!--   v-btn( -->
    <!--     v-if='upBtnShown' -->
    <!--     fab -->
    <!--     fixed -->
    <!--     bottom -->
    <!--     :right='$vuetify.rtl' -->
    <!--     :left='!$vuetify.rtl' -->
    <!--     small -->
    <!--     :depressed='this.$vuetify.breakpoint.mdAndUp' -->
    <!--     @click='$vuetify.goTo(0, scrollOpts)' -->
    <!--     color='primary' -->
    <!--     dark -->
    <!--     :style='upBtnPosition' -->
    <!--     :aria-label='$t(`common:actions.returnToTop`)' -->
    <!--     ) -->
    <!--     v-icon mdi-arrow-up -->
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
import Icon from './icon'

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
      navShown: false,
      navExpanded: false,
      upBtnShown: false,
      pageEditFab: false,
      pageContainerHeight: 0,
      pageContentHeight: 0,
      timestamps: [
        {
          dataStart: 0,
          dataEnd: 30,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/01.png',
        },
        {
          dataStart: 30,
          dataEnd: 60,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/02.png',
        },
        {
          dataStart: 60,
          dataEnd: 90,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/03.png',
        },
        {
          dataStart: 90,
          dataEnd: 120,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/04.png',
        },
        {
          dataStart: 120,
          dataEnd: 150,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/05.png',
        },
        {
          dataStart: 150,
          dataEnd: 180,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/06.png',
        },
        {
          dataStart: 180,
          dataEnd: 210,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/07.png',
        },
        {
          dataStart: 210,
          dataEnd: 240,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/08.png',
        },
        {
          dataStart: 240,
          dataEnd: 270,
          url: 'https://res.cloudinary.com/ghost-order/image/upload/v1680824033/joan-test/09.png',
        },
      ],
      videoSrc: '',
      videoPos: 0,
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
    isAuthenticated: get('user/authenticated'),
    commentsCount: get('page/commentsCount'),
    commentsPerms: get('page/effectivePermissions@comments'),
    editShortcutsObj: get('page/editShortcuts'),
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
      console.log('tocDecoded: ', JSON.parse(Buffer.from(this.toc, 'base64').toString()));
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
    this.$watch(
      () => {
        return this.$refs.headerRef.clientHeight
      },
      (val) => {
        console.log('headerRef height: ', val);
      }
    )
    const pageContent = document.getElementsByClassName('is-page-content')[0];
    const breadcrumbsContainer = document.getElementsByClassName('breadcrumbs-container')[0];
    const breadcrumbsContainerHeight = breadcrumbsContainer?.clientHeight || 0;
    console.log('breadcrumbsContainerHeight: ', breadcrumbsContainerHeight);

    const video = document.querySelector('#presentationVideo');
      video.style.display = 'none';
    const videoSource = video.querySelector('source');
    this.videoSrc = videoSource.src
    console.log('video source: ', videoSource.src);

    this.pageContainerHeight = window.innerHeight - breadcrumbsContainerHeight - 64; // top bar height is 64px
    console.log('headerRef: ', this.$refs.headerRef.clientHeight);
    this.pageContentHeight = window.innerHeight - breadcrumbsContainerHeight - this.$refs.headerRef.clientHeight - 64;
    // for some reason the containers for both the text and the sliders is slightly smaller than it should be to wrap all the respective content
    // and thus it causes the last element of each to not display completelly

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
      this.$refs.container.querySelectorAll(`a[href^="#"], a[href^="${window.location.href.replace(window.location.hash, '')}#"]`).forEach(el => {
        el.onclick = ev => {
          ev.preventDefault()
          ev.stopPropagation()
          this.$vuetify.goTo(decodeURIComponent(ev.currentTarget.hash), this.scrollOpts)
        }
      })

      window.boot.notify('page-ready')
    })
  },
  beforeUnmount () {
    window.removeEventListener('hashchange', () => this.navigateToResult())
    window.removeEventListener('resize', () => {
      console.log('new inner height is: ', window.innerHeight);
    })
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
      const selectedSlide = e.target.offsetParent.parentElement
        selectedSlide.style.width = '0px'
        selectedSlide.style.marginTop = '-1.7em'

      const selectedSlideOrder = parseInt(selectedSlide.style.order);
      const selectedTimeFrame = this.timestamps.find((t, idx) => idx + 1 === selectedSlideOrder);

      this.$refs.video.currentTime = selectedTimeFrame.dataStart
      this.$refs.video.play()

      this.$refs.slides.forEach((slide, idx) => {
        if (selectedSlideOrder !== idx + 1) {
          slide.style.width = '100%'
          slide.style.marginTop = '0'
        };
      })

      this.videoPos = selectedSlide.style.order = selectedSlide.style.order
    },
    handleTocNavigation (tocItem) {
      console.log(tocItem);
      console.log('content ref: ', this.$refs.container);
      this.$vuetify.goTo(tocItem.anchor, {
        container: this.$refs.container
      })
    }
  },
  watch: {
    pageContainerHeight (newValue, oldValue) {
      console.log('new page height: ', newValue);
    },
    upBtnShown(_, newValue) {
      if (newValue) {
        const paragraphs = Array.from(document.querySelectorAll('.text-container p'));
        const location = String(window.location);
        const pid = location.substring(location.indexOf('#'));
        console.log('pid: ', pid);
        console.log('paragraphs: ', paragraphs);
        paragraphs.forEach(p => {
          if (p.id === pid) {
            console.log('AAAA');
            Array.from(p.children).forEach(child => child.classList.add('highlighted-on-select'))
          } else {
            console.log('BBBB');
            Array.from(p.children).forEach(child => child.classList.remove('highlighted-on-select'))
          };
        })
      };
    }
  }
}
</script>

<style lang="scss">
@import '../scss/variables';

path{
  fill: $dark-gray;
}

.page-container {
  overflow: hidden;

  & h2 {
    font-size: 1rem;
    // color: black;
  }

  & h3 {
    font-size: .85rem;
  }
}

.is-page-content {
  overflow: scroll;
}
.is-page-timestamps {
  overflow: scroll;
  display: flex;
  flex-direction: column;
  gap: 1.7em;

  & video {
    width: 100%;
  }

  & > .v-list {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin: 0px; padding: 0px;  
  }

  & .timestamps {
    background-color: red;

    & div {
      width: 100%;
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

.page-toc-section {
  background-color: $gray;

  & .page-toc-header {
    color: black;
  }
}
.page-toc-section.v-list {
  background-color: $gray;

  & .v-list-item {
    min-height: 0px;
    padding: .4em 0px;
  }
}

.page-header-section {
  background-color: $gray;
  position: relative;

  > .is-page-header {
    position: relative;
  }

  .page-header-headings {
    min-height: 52px;
    display: flex;
    justify-content: space-between;

    & > .page-header-headings-text {
      display: flex;
      justify-content: center;
      flex-direction: column;

      & h1 {
        font-size: 1.18rem;
      }

      & .description {
        font-size: .9rem;
      }
    }

    & > .page-info {
      display: flex;
      align-items: center;
      gap: 1em;
      color: $dark-gray;
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
}

</style>
