<template lang='pug'>
  .editor-markdown
    v-toolbar.editor-markdown-toolbar(flat, height="80")
      template(v-if='isModalShown')
        v-spacer
        v-btn.animated.fadeInRight(text, @click='closeAllModal')
          v-icon(left) mdi-arrow-left-circle
          span {{$t('editor:backToEditor')}}
      v-layout.row(v-else, justify-space-between)
        .d-flex(gap="20px")
          v-btn(
            icon
            @click="goToPreview"
            :class="viewMode === 'preview' ? 'activeView' : ''"
            )
            icon(name="preview")
          v-btn(
            icon
            @click="goToEdit"
            :class="viewMode === 'edit' ? 'activeView' : ''"
            )
            icon(name="edit-page")
          v-btn(
            icon
            @click="goToSettings"
            :class="viewMode === 'settings' ? 'activeView' : ''"
            )
            icon(name="settings")
        .d-flex.align-center(v-if="viewMode === 'edit'")
          v-menu(offset-y, open-on-hover)
            template(v-slot:activator='{ on }')
              v-btn.mx-0.heading-dropdown(color="rgba(0, 0, 0, 0)", plain, depressed, v-on='on') Headline
                <!-- v-icon mdi-format-header-pound -->
                icon.ml-3(name="dropdown")
            v-list.py-0()
              template(v-for='(n, idx) in 6')
                v-list-item(@click='setHeaderLine(n)', :key='idx')
                  v-list-item-action
                    v-icon(:size='24 - (idx - 1) * 2') mdi-format-header-{{n}}
                  <!-- v-list-item-title {{$t('editor:markup.heading', { level: n })}} -->
                v-divider(v-if='idx < 5')
          v-divider(vertical)
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, plain, v-on='on', @click='toggleMarkup({ start: `**` })').mx-0
                icon(name="bold")
            span {{$t('editor:markup.bold')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleMarkup({ start: `*` })').mx-0
                icon(name="italic")
            span {{$t('editor:markup.italic')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleMarkup({ start: `~~` })').mx-0
                v-icon mdi-format-strikethrough
            span {{$t('editor:markup.strikethrough')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleMarkup({ start: `~` })').mx-0
                v-icon mdi-format-subscript
            span {{$t('editor:markup.subscript')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleMarkup({ start: `^` })').mx-0
                v-icon mdi-format-superscript
            span {{$t('editor:markup.superscript')}}
          v-menu(offset-y, open-on-hover)
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on').mx-0
                v-icon mdi-alpha-t-box-outline
            v-list.py-0
              v-list-item(@click='insertBeforeEachLine({ content: `> `})')
                v-list-item-action
                  v-icon mdi-alpha-t-box-outline
                v-list-item-title {{$t('editor:markup.blockquote')}}
              v-divider
              v-list-item(@click='insertBeforeEachLine({ content: `> `, after: `{.is-info}`})')
                v-list-item-action
                  v-icon(color='blue') mdi-alpha-i-box-outline
                v-list-item-title {{$t('editor:markup.blockquoteInfo')}}
              v-divider
              v-list-item(@click='insertBeforeEachLine({ content: `> `, after: `{.is-success}`})')
                v-list-item-action
                  v-icon(color='success') mdi-alpha-s-box-outline
                v-list-item-title {{$t('editor:markup.blockquoteSuccess')}}
              v-divider
              v-list-item(@click='insertBeforeEachLine({ content: `> `, after: `{.is-warning}`})')
                v-list-item-action
                  v-icon(color='warning') mdi-alpha-w-box-outline
                v-list-item-title {{$t('editor:markup.blockquoteWarning')}}
              v-divider
              v-list-item(@click='insertBeforeEachLine({ content: `> `, after: `{.is-danger}`})')
                v-list-item-action
                  v-icon(color='error') mdi-alpha-e-box-outline
                v-list-item-title {{$t('editor:markup.blockquoteError')}}
              v-divider
          v-divider(vertical)
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='insertBeforeEachLine({ content: `- `})').mx-0
                icon(name="unordered-list")
            span {{$t('editor:markup.unorderedList')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='insertBeforeEachLine({ content: `1. `})').mx-0
                icon(name="ordered-list")
            span {{$t('editor:markup.orderedList')}}
          v-divider(vertical)
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleMarkup({ start: "`" })').mx-0
                v-icon mdi-code-tags
            span {{$t('editor:markup.inlineCode')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleMarkup({ start: `<kbd>`, end: `</kbd>` })').mx-0
                v-icon mdi-keyboard-variant
            span {{$t('editor:markup.keyboardKey')}}
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='insertAfter({ content: `---`, newLine: true })').mx-0
                v-icon mdi-minus
            span {{$t('editor:markup.horizontalBar')}}
          v-divider(vertical)
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleModal(`editorModalDrawio`)').mx-0
                icon(name="diagram")
            span Insert diagram
          v-tooltip(bottom, color='primary')
            template(v-slot:activator='{ on }')
              v-btn(icon, tile, v-on='on', @click='toggleModal(`editorModalMedia`)').mx-0
                icon(name="asset")
            span Insert asset
        .d-flex.align-center(v-if='$vuetify.breakpoint.mdAndUp')
          <!-- v-tooltip(bottom, color='primary', v-if='previewShown') -->
          <!--   template(v-slot:activator='{ on }') -->
          <!--     v-btn.animated.fadeIn.wait-p1s(icon, tile, v-on='on', @click='spellModeActive = !spellModeActive').mx-0 -->
          <!--       v-icon mdi-spellcheck -->
          <!--   span {{$t('editor:markup.toggleSpellcheck')}} -->
          v-btn.mr-3.animated.fadeIn(color='amber', outlined, small, v-if='isConflict', @click='openConflict')
            .overline.amber--text.mr-3 Conflict
            status-indicator(intermediary, pulse)
          v-btn.pa-0.save-btn(
            text
            @click.exact='save'
            :class='{ "is-icon": $vuetify.breakpoint.mdAndDown }'
            )
            span(v-if='$vuetify.breakpoint.lgAndUp && mode !== `create` && !isDirty') {{ $t('editor:save.saved') }}
            <!-- span(v-else-if='$vuetify.breakpoint.lgAndUp') {{ mode === 'create' ? $t('common:actions.create') : $t('common:actions.save') }} -->
            span(v-else-if='$vuetify.breakpoint.lgAndUp') {{ mode === 'create' ? 'Transcribe' : 'Save' }}
            icon(name="save")
          <!-- slot(name='actions') -->
          <!-- v-tooltip(bottom, color='primary') -->
          <!--   template(v-slot:activator='{ on }') -->
          <!--     v-btn.animated.fadeIn.wait-p2s(icon, tile, v-on='on', @click='previewShown = !previewShown').mx-0 -->
          <!--       v-icon mdi-book-open-outline -->
          <!--   span {{$t('editor:markup.togglePreviewPane')}} -->
    .editor-markdown-main(ref="editorMarkdownMain")
      <!-- need to put these on the toolbar -->

      <!-- .editor-markdown-sidebar -->
      <!--   v-tooltip(right, color='teal') -->
      <!--     template(v-slot:activator='{ on }') -->
      <!--       v-btn.animated.fadeInLeft(icon, tile, v-on='on', dark, @click='insertLink').mx-0 -->
      <!--         v-icon mdi-link-plus -->
      <!--     span {{$t('editor:markup.insertLink')}} -->
      <!--   v-tooltip(right, color='teal') -->
      <!--     template(v-slot:activator='{ on }') -->
      <!--       v-btn.mt-3.animated.fadeInLeft.wait-p1s(icon, tile, v-on='on', dark, @click='toggleModal(`editorModalMedia`)').mx-0 -->
      <!--         v-icon(:color='activeModal === `editorModalMedia` ? `teal` : ``') mdi-folder-multiple-image -->
      <!--     span {{$t('editor:markup.insertAssets')}} -->
      <!--   v-tooltip(right, color='teal') -->
      <!--     template(v-slot:activator='{ on }') -->
      <!--       v-btn.mt-3.animated.fadeInLeft.wait-p2s(icon, tile, v-on='on', dark, @click='toggleModal(`editorModalDrawio`)').mx-0 -->
      <!--         v-icon mdi-chart-multiline -->
      <!--     span {{$t('editor:markup.insertDiagram')}} -->
      <!--   v-tooltip(right, color='teal') -->
      <!--     template(v-slot:activator='{ on }') -->
      <!--       v-btn.mt-3.animated.fadeInLeft.wait-p2s(icon, tile, v-on='on', dark, @click='toggleModal(`editorVideoUpload`)').mx-0 -->
      <!--         v-icon mdi-video-plus -->
      <!--     span {{ "Transcribe A Video" }} -->
      <!--   template(v-if='$vuetify.breakpoint.mdAndUp') -->
      <!--     v-spacer -->
      <!--     v-tooltip(right, color='teal') -->
      <!--       template(v-slot:activator='{ on }') -->
      <!--         v-btn.mt-3.animated.fadeInLeft.wait-p3s(icon, tile, v-on='on', dark, @click='toggleFullscreen').mx-0 -->
      <!--           v-icon mdi-arrow-expand-all -->
      <!--       span {{$t('editor:markup.distractionFreeMode')}} -->
      <!--     v-tooltip(right, color='teal') -->
      <!--       template(v-slot:activator='{ on }') -->
      <!--         v-btn.mt-3.animated.fadeInLeft.wait-p4s(icon, tile, v-on='on', dark, @click='toggleHelp').mx-0 -->
      <!--           v-icon(:color='helpShown ? `teal` : ``') mdi-help-circle -->
      <!--       span {{$t('editor:markup.markdownFormattingHelp')}} -->
      .editor-markdown-editor(
        :style="{ display: viewMode === 'edit' ? 'block' : 'none', height: contentHeight + 'px' }"
      )
        .editor-title-container.py-8.mb-6
          v-text-field.editor-title-input(
            solo
            flat
            v-model='currentPageTitle'
            hide-details
            full-width
          )
        textarea(ref='cm')
      .editor-markdown-preview(
        :style="{ display: viewMode === 'edit' || viewMode === 'preview' ? 'block' : 'none', height: contentHeight + 'px' }"
      )
        div(
          ref='editorPreview'
          v-html='previewHTML'
          :spellcheck='spellModeActive'
          :contenteditable='spellModeActive'
          @blur='spellModeActive = false'
        )
      .editor-markdown-page-settings(
        v-if="viewMode === 'settings'"
        :style="{ display: viewMode === 'settings' ? 'flex' : none, height: contentHeight + 'px' }"
      )
        .page-settings-menu(:style="{ height: contentHeight + 'px' }")
          v-list
            v-list-item-group(
              v-model="settingsTabs.active"
            )
              v-list-item(
                v-for="(tab, idx) in settingsTabs.tabs"
                :key="'setting-' + tab"
                @click="goToSettingSection(tab + '-section')"
              )
                v-list-item-content
                  v-list-item-title(v-text="tab.slice(0, 1).toUpperCase() + tab.slice(1)")
        .page-settings-content(:style="{ height: contentHeight + 'px' }")
          section.settings-section#page-section
            h2 Page
            .input-container
              label(htmlFor="page-title") Title
              input(
                name="page-tile"
                placeholder="Name of the document"
                v-model="title"
              )
            .input-container
              label(htmlFor="page-path") Path
              .d-flex
                input(
                  name="page-path"
                  placeholder="Path of the document"
                  v-model="path"
                )
                .v-btn(text, @click="pageMove") Move
          section.settings-section#video-section
            h2 Video
            .input-container
              label(htmlFor="page-title") Source
              .d-flex
                input(
                  name="video-source"
                  placeholder="Https://..."
                )
                .v-btn(text, @click="uploadAttempt = true") Select local file
          section.settings-section#access-section
            h2 Access
            .d-flex.align-center.justify-space-between.px-6
              span(v-if="isPublic") Public
              span(v-if="!isPublic") Private
              v-switch(v-model="isPublic", inset)
        page-selector(
          mode='move'
          v-model='movePageModal'
          :open-handler='pageMoveRename'
          :path='path'
          :locale='locale'
        )
        v-dialog(v-model="isPrivate", width='500px', @click:outside="isPublic = true")
          v-card
            v-card-title subscription required
            v-card-text A subscription plan is required to made pages private.
            v-divider
            v-card-actions
              v-btn(text, @click.stop="isPublic = true") accept
        v-dialog(v-model="uploadAttempt", width='500px', @click:outside="uploadAttempt = false")
          v-card
            v-card-title Upload your plan
            <!-- v-card-text  -->
            <!-- v-divider -->
            v-card-actions
              v-btn(text, @click.stop="uploadAttempt = false") accept


      <!-- #page-slides( -->
      <!--   v-html='previewHTML' -->
      <!-- ) -->

    <!-- v-system-bar.editor-markdown-sysbar(dark, status, color='grey darken-3') -->
    <!--   .caption.editor-markdown-sysbar-locale {{locale.toUpperCase()}} -->
    <!--   .caption.px-3 /{{path}} -->
    <!--   template(v-if='$vuetify.breakpoint.mdAndUp') -->
    <!--     v-spacer -->
    <!--     .caption Markdown -->
    <!--     v-spacer -->
    <!--     .caption Ln {{cursorPos.line + 1}}, Col {{cursorPos.ch + 1}} -->

    markdown-help(v-if='helpShown')
</template>

<script>
import _ from 'lodash'
import { get, sync } from 'vuex-pathify'
import markdownHelp from './markdown/help.vue'
import gql from 'graphql-tag'
import DOMPurify from 'dompurify'
import * as cheerio from 'cheerio'
import { getElementSize } from '../../helpers/utils'
import pageSelector from '../common/page-selector.vue'
import movePageMutation from 'gql/common/common-pages-mutation-move.gql'

/* global siteConfig, siteLangs */

// ========================================
// IMPORTS
// ========================================

// Code Mirror
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

// Language
import 'codemirror/mode/markdown/markdown.js'

// Addons
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/display/fullscreen.js'
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'

// Markdown-it
import MarkdownIt from 'markdown-it'
import mdAttrs from 'markdown-it-attrs'
import mdDecorate from 'markdown-it-decorate'
import mdEmoji from 'markdown-it-emoji'
import mdTaskLists from 'markdown-it-task-lists'
import mdExpandTabs from 'markdown-it-expand-tabs'
import mdAbbr from 'markdown-it-abbr'
import mdSup from 'markdown-it-sup'
import mdSub from 'markdown-it-sub'
import mdMark from 'markdown-it-mark'
import mdMultiTable from 'markdown-it-multimd-table'
import mdFootnote from 'markdown-it-footnote'
import mdImsize from 'markdown-it-imsize'
import katex from 'katex'
import underline from '../../libs/markdown-it-underline'
import 'katex/dist/contrib/mhchem'
import twemoji from 'twemoji'
import plantuml from './markdown/plantuml'
import videoRenderer from './markdown/video/renderer'

// Prism (Syntax Highlighting)
import Prism from 'prismjs'

// Mermaid
import mermaid from 'mermaid'

// Helpers
import katexHelper from './common/katex'
import tabsetHelper from './markdown/tabset'
import cmFold from './common/cmFold'

import Icon from '../icon'

// ========================================
// INIT
// ========================================

// Platform detection
const CtrlKey = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl'

// Prism Config
Prism.plugins.autoloader.languages_path = '/_assets/js/prism/'
Prism.plugins.NormalizeWhitespace.setDefaults({
  'remove-trailing': true,
  'remove-indent': true,
  'left-trim': true,
  'right-trim': true,
  'remove-initial-line-feed': true,
  'tabs-to-spaces': 2
})

// Markdown Instance
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typography: true,
  highlight(str, lang) {
    if (lang === 'diagram') {
      return `<pre class="diagram">` + Buffer.from(str, 'base64').toString() + `</pre>`
    } else if (['mermaid', 'plantuml'].includes(lang)) {
      return `<pre class="codeblock-${lang}"><code>${_.escape(str)}</code></pre>`
    } else {
      return `<pre class="line-numbers"><code class="language-${lang}">${_.escape(str)}</code></pre>`
    }
  }
})
  .use(mdAttrs, {
    allowedAttributes: ['id', 'class', 'target']
  })
  .use(mdDecorate)
  .use(underline)
  .use(mdEmoji)
  .use(mdTaskLists, { label: false, labelAfter: false })
  .use(mdExpandTabs)
  .use(mdAbbr)
  .use(mdSup)
  .use(mdSub)
  .use(mdMultiTable, { multiline: true, rowspan: true, headerless: true })
  .use(mdMark)
  .use(mdFootnote)
  .use(mdImsize)

// DOMPurify fix for draw.io
DOMPurify.addHook('uponSanitizeElement', (elm) => {
  if (elm.querySelectorAll) {
    const breaks = elm.querySelectorAll('foreignObject br, foreignObject p')
    if (breaks && breaks.length) {
      for (let i = 0; i < breaks.length; i++) {
        breaks[i].parentNode.replaceChild(
          document.createElement('div'),
          breaks[i]
        )
      }
    }
  }
})

// ========================================
// HELPER FUNCTIONS
// ========================================

// Inject line numbers for preview scroll sync
let linesMap = []
function injectLineNumbers (tokens, idx, options, env, slf) {
  let line
  if (tokens[idx].map && tokens[idx].level === 0) {
    line = tokens[idx].map[0]
    tokens[idx].attrJoin('class', 'line')
    tokens[idx].attrSet('data-line', String(line))
    linesMap.push(line)
  }
  return slf.renderToken(tokens, idx, options, env, slf)
}
md.renderer.rules.paragraph_open = injectLineNumbers
md.renderer.rules.heading_open = injectLineNumbers
md.renderer.rules.blockquote_open = injectLineNumbers

cmFold.register('markdown')
// ========================================
// PLANTUML
// ========================================

// TODO: Use same options as defined in backend
plantuml.init(md, {})

// ========================================
// KATEX
// ========================================

const macros = {}
md.inline.ruler.after('escape', 'katex_inline', katexHelper.katexInline)
md.renderer.rules.katex_inline = (tokens, idx) => {
  try {
    return katex.renderToString(tokens[idx].content, {
      displayMode: false, macros
    })
  } catch (err) {
    console.warn(err)
    return tokens[idx].content
  }
}
md.block.ruler.after('blockquote', 'katex_block', katexHelper.katexBlock, {
  alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
})
md.renderer.rules.katex_block = (tokens, idx) => {
  try {
    return `<p>` + katex.renderToString(tokens[idx].content, {
      displayMode: true, macros
    }) + `</p>`
  } catch (err) {
    console.warn(err)
    return tokens[idx].content
  }
}

// ========================================
// TWEMOJI
// ========================================

md.renderer.rules.emoji = (token, idx) => {
  return twemoji.parse(token[idx].content, {
    callback (icon, opts) {
      return `/_assets/svg/twemoji/${icon}.svg`
    }
  })
}

// ========================================
// Vue Component
// ========================================

let mermaidId = 0

export default {
  components: {
    markdownHelp,
    Icon,
    pageSelector,
  },
  props: {
    save: {
      type: Function,
      default: () => {}
    },
    saveAndClose: {
      type: Function,
      default: () => {}
    },
    exit: {
      type: Function,
      default: () => {}
    },
    exitGo: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      fabInsertMenu: false,
      isConflict: false,
      cm: null,
      cursorPos: { ch: 0, line: 1 },
      // previewShown: true,
      movePageModal: false,
      previewHTML: '',
      isPublic: true,
      uploadAttempt: false,
      helpShown: false,
      spellModeActive: false,
      insertLinkDialog: false,
      viewMode: 'edit',
      contentHeight: 0,
      settingsTabs: {
        active: 0,
        tabs: [ 'page', 'video', 'access' ]
      },
      savedState: {
        description: '',
        isPublished: false,
        publishEndDate: '',
        publishStartDate: '',
        tags: '',
        title: '',
        css: '',
        js: ''
      }
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown
    },
    isModalShown() {
      return this.helpShown || this.activeModal !== ''
    },
    locale: get('page/locale'),
    path: get('page/path'),
    mode: get('editor/mode'),
    title: sync('page/title'),
    path: sync('page/path'),
    currentPageTitle: sync('page/title'),
    mode: get('editor/mode'),
    activeModal: sync('editor/activeModal'),
    isDirty () {
      return _.some([
        this.initContentParsed !== this.$store.get('editor/content'),
        this.locale !== this.$store.get('page/locale'),
        this.path !== this.$store.get('page/path'),
        this.savedState.title !== this.$store.get('page/title'),
        this.savedState.description !== this.$store.get('page/description'),
        this.savedState.tags !== this.$store.get('page/tags'),
        this.savedState.isPublished !== this.$store.get('page/isPublished'),
        this.savedState.publishStartDate !== this.$store.get('page/publishStartDate'),
        this.savedState.publishEndDate !== this.$store.get('page/publishEndDate'),
        this.savedState.css !== this.$store.get('page/scriptCss'),
        this.savedState.js !== this.$store.get('page/scriptJs')
      ], Boolean)
    },
    isPrivate() {
      if (!this.isPublic) {
        return true
      } else {
        return false
      };
    }
  },
  watch: {
    previewShown (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.$nextTick(() => {
          this.renderMermaidDiagrams()
          Prism.highlightAllUnder(this.$refs.editorPreview)
          Array.from(this.$refs.editorPreview.querySelectorAll('pre.line-numbers')).forEach(pre => pre.classList.add('prismjs'))
        })
      }
    },
    spellModeActive (newValue, oldValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.editorPreview.focus()
        })
      }
    },
    previewHTML (newValue) {
      console.log('pageSlides on previewHTML value update', document.getElementById('page-slides'));
    },
    viewMode (newValue) {
      console.log('new viewMode: ', newValue);
      const pageSlides = document.getElementById('page-slides');
      const pageContent = document.getElementById('page-content');
      // console.log('pageSlides on viewMode change: ', pageSlides);
      // console.log('pageContent on viewMode change: ', pageContent);

      if (newValue === 'preview') {
        pageSlides.classList.add('is-preview-mode')
        pageContent.classList.add('is-preview-mode')
      } else if (newValue === 'edit') {
        pageSlides.classList.remove('is-preview-mode')
        pageContent.classList.remove('is-preview-mode')
      } else {
        pageSlides.classList.remove('is-preview-mode')
        pageContent.classList.remove('is-preview-mode')
      };


    }
  },
  methods: {
    toggleModal(key) {
      this.activeModal = (this.activeModal === key) ? '' : key
      this.helpShown = false
    },
    closeAllModal() {
      this.activeModal = ''
      this.helpShown = false
    },
    onCmInput: _.debounce(function (newContent) {
      this.processContent(newContent)
    }, 600),
    onCmPaste (cm, ev) {
      // const clipItems = (ev.clipboardData || ev.originalEvent.clipboardData).items
      // for (let clipItem of clipItems) {
      //   if (_.startsWith(clipItem.type, 'image/')) {
      //     const file = clipItem.getAsFile()
      //     const reader = new FileReader()
      //     reader.onload = evt => {
      //       this.$store.commit(`loadingStart`, 'editor-paste-image')
      //       this.insertAfter({
      //         content: `![${file.name}](${evt.target.result})`,
      //         newLine: true
      //       })
      //     }
      //     reader.readAsDataURL(file)
      //   }
      // }
    },
    processContent (newContent = this.$store.get('editor/content')) {
      const topbarHeight = getElementSize('#top-bar', 'height');
      const toolbarHeight = getElementSize('.editor-markdown-toolbar', 'height');
      const contentHeight = window.innerHeight - topbarHeight - toolbarHeight;

      linesMap = []
      // this.$store.set('editor/content', newContent)
      this.processMarkers(this.cm.firstLine(), this.cm.lastLine())
      this.previewHTML = DOMPurify.sanitize(md.render(newContent, { clientPage: 'edit' }), {
        ADD_TAGS: ['foreignObject']
      })
      this.$nextTick(() => {
        tabsetHelper.format()
        this.renderMermaidDiagrams()
        Prism.highlightAllUnder(this.$refs.editorPreview)
        Array.from(this.$refs.editorPreview.querySelectorAll('pre.line-numbers')).forEach(pre => pre.classList.add('prismjs'))
        const pageSlides = document.getElementById('page-slides');
        const pageContent = document.getElementById('page-content');
        pageSlides.style.height = String(contentHeight) + 'px'
        pageContent.style.height = String(contentHeight) + 'px'
      })
    },
    /**
     * Update cursor state
     */
    positionSync(cm) {
      this.cursorPos = cm.getCursor('head')
    },
    /**
     * Wrap selection with start / end tags
     */
    toggleMarkup({ start, end }) {
      if (!end) { end = start }
      if (!this.cm.doc.somethingSelected()) {
        return this.$store.commit('showNotification', {
          message: this.$t('editor:markup.noSelectionError'),
          style: 'warning',
          icon: 'warning'
        })
      }
      this.cm.doc.replaceSelections(this.cm.doc.getSelections().map(s => start + s + end))
    },
    /**
     * Set current line as header
     */
    setHeaderLine(lvl) {
      const curLine = this.cm.doc.getCursor('head').line
      let lineContent = this.cm.doc.getLine(curLine)
      const lineLength = lineContent.length
      if (_.startsWith(lineContent, '#')) {
        lineContent = lineContent.replace(/^(#+ )/, '')
      }
      lineContent = _.times(lvl, n => '#').join('') + ` ` + lineContent
      this.cm.doc.replaceRange(lineContent, { line: curLine, ch: 0 }, { line: curLine, ch: lineLength })
    },
    /**
     * Get the header lever of the current line
     */
    getHeaderLevel(cm) {
      const curLine = this.cm.doc.getCursor('head').line
      let lineContent = this.cm.doc.getLine(curLine)
      let lvl = 0

      const result = lineContent.match(/^(#+) /)
      if (result) {
        lvl = _.get(result, '[1]', '').length
      }
      return lvl
    },
    /**
     * Insert content at cursor
     */
    insertAtCursor({ content }) {
      const cursor = this.cm.doc.getCursor('head')
      this.cm.doc.replaceRange(content, cursor)
    },
    /**
     * Insert content after current line
     */
    insertAfter({ content, newLine }) {
      const curLine = this.cm.doc.getCursor('to').line
      const lineLength = this.cm.doc.getLine(curLine).length
      this.cm.doc.replaceRange(newLine ? `\n${content}\n` : content, { line: curLine, ch: lineLength + 1 })
    },
    /**
     * Insert content before current line
     */
    insertBeforeEachLine({ content, after }) {
      let lines = []
      if (!this.cm.doc.somethingSelected()) {
        lines.push(this.cm.doc.getCursor('head').line)
      } else {
        lines = _.flatten(this.cm.doc.listSelections().map(sl => {
          const range = Math.abs(sl.anchor.line - sl.head.line) + 1
          const lowestLine = (sl.anchor.line > sl.head.line) ? sl.head.line : sl.anchor.line
          return _.times(range, l => l + lowestLine)
        }))
      }
      lines.forEach(ln => {
        let lineContent = this.cm.doc.getLine(ln)
        const lineLength = lineContent.length
        if (_.startsWith(lineContent, content)) {
          lineContent = lineContent.substring(content.length)
        }

        this.cm.doc.replaceRange(content + lineContent, { line: ln, ch: 0 }, { line: ln, ch: lineLength })
      })
      if (after) {
        const lastLine = _.last(lines)
        this.cm.doc.replaceRange(`\n${after}\n`, { line: lastLine, ch: this.cm.doc.getLine(lastLine).length + 1 })
      }
    },
    /**
     * Update scroll sync
     */
    // scrollSync: _.debounce(function (cm) {
    //   if (!this.previewShown || cm.somethingSelected()) { return }
    //   let currentLine = cm.getCursor().line
    //   if (currentLine < 3) {
    //     this.Velocity(this.$refs.editorPreview, 'stop', true)
    //     this.Velocity(this.$refs.editorPreview?.firstChild, 'scroll', { offset: '-50', duration: 1000, container: this.$refs.editorPreviewContainer })
    //   } else {
    //     let closestLine = _.findLast(linesMap, n => n <= currentLine)
    //     let destElm = this.$refs.editorPreview.querySelector(`[data-line='${closestLine}']`)
    //     if (destElm) {
    //       this.Velocity(this.$refs.editorPreview, 'stop', true)
    //       this.Velocity(destElm, 'scroll', { offset: '-100', duration: 1000, container: this.$refs.editorPreviewContainer })
    //     }
    //   }
    // }, 500),
    toggleHelp () {
      this.helpShown = !this.helpShown
      this.activeModal = ''
    },
    toggleFullscreen () {
      this.cm.setOption('fullScreen', true)
    },
    refresh() {
      this.$nextTick(() => {
        this.cm.refresh()
      })
    },
    renderMermaidDiagrams () {
      document.querySelectorAll('.editor-markdown-preview pre.codeblock-mermaid > code').forEach(elm => {
        mermaidId++
        const mermaidDef = elm.innerText
        const mmElm = document.createElement('div')
        mmElm.innerHTML = `<div id="mermaid-id-${mermaidId}">${mermaid.render(`mermaid-id-${mermaidId}`, mermaidDef)}</div>`
        elm.parentElement.replaceWith(mmElm)
      })
    },
    autocomplete (cm, change) {
      if (cm.getModeAt(cm.getCursor()).name !== 'markdown') {
        return
      }

      // Links
      if (change.text[0] === '(') {
        const curLine = cm.getLine(change.from.line).substring(0, change.from.ch)
        if (curLine[curLine.length - 1] === ']') {
          cm.showHint({
            hint: async (cm, options) => {
              const cur = cm.getCursor()
              const curLine = cm.getLine(cur.line).substring(0, cur.ch)
              const queryString = curLine.substring(curLine.lastIndexOf('[') + 1, curLine.length - 2)
              const token = cm.getTokenAt(cur)
              try {
                const respRaw = await this.$apollo.query({
                  query: gql`
                    query ($query: String!, $locale: String) {
                      pages {
                        search(query:$query, locale:$locale) {
                          results {
                            title
                            path
                            locale
                          }
                          totalHits
                        }
                      }
                    }
                  `,
                  variables: {
                    query: queryString,
                    locale: this.locale
                  },
                  fetchPolicy: 'cache-first'
                })
                const resp = _.get(respRaw, 'data.pages.search', {})
                if (resp && resp.totalHits > 0) {
                  return {
                    list: resp.results.map(r => ({
                      text: '(' + (siteLangs.length > 0 ? `/${r.locale}/${r.path}` : `/${r.path}`) + ')',
                      displayText: siteLangs.length > 0 ? `/${r.locale}/${r.path} - ${r.title}` : `/${r.path} - ${r.title}`
                    })),
                    from: CodeMirror.Pos(cur.line, token.start),
                    to: CodeMirror.Pos(cur.line, token.end)
                  }
                }
              } catch (err) {}
              return {
                list: [],
                from: CodeMirror.Pos(cur.line, token.start),
                to: CodeMirror.Pos(cur.line, token.end)
              }
            }
          })
        }
      }
    },
    insertLink () {
      this.insertLinkDialog = true
    },
    insertLinkHandler ({ locale, path }) {
      const lastPart = _.last(path.split('/'))
      this.insertAtCursor({
        content: siteLangs.length > 0 ? `[${lastPart}](/${locale}/${path})` : `[${lastPart}](/${path})`
      })
    },
    processMarkers (from, to) {
      let found = null
      let foundStart = 0
      this.cm.doc.getAllMarks().forEach(mk => {
        if (mk.__kind) {
          mk.clear()
        }
      })
      this.cm.eachLine(from, to, ln => {
        const line = ln.lineNo()
        if (ln.text.startsWith('```diagram')) {
          found = 'diagram'
          foundStart = line
        } else if (ln.text === '```' && found) {
          switch (found) {
            // ------------------------------
            // -> DIAGRAM
            // ------------------------------
            case 'diagram': {
              if (line - foundStart !== 2) {
                return
              }
              this.addMarker({
                kind: 'diagram',
                from: { line: foundStart, ch: 3 },
                to: { line: foundStart, ch: 10 },
                text: 'Edit Diagram',
                action: ((start, end) => {
                  return (ev) => {
                    this.cm.doc.setSelection({ line: start, ch: 0 }, { line: end, ch: 3 })
                    try {
                      const raw = this.cm.doc.getLine(end - 1)
                      this.$store.set('editor/activeModalData', Buffer.from(raw, 'base64').toString())
                      this.toggleModal(`editorModalDrawio`)
                    } catch (err) {
                      return this.$store.commit('showNotification', {
                        message: 'Failed to process diagram data.',
                        style: 'warning',
                        icon: 'warning'
                      })
                    }
                  }
                })(foundStart, line)
              })
              if (ln.height > 0) {
                this.cm.foldCode(foundStart)
              }
              break
            }
          }
          found = null
        }
      })
    },
    resizeComponents () {
      const topbarHeight = getElementSize('#top-bar', 'height');
      const toolbarHeight = getElementSize('.editor-markdown-toolbar', 'height');
      const contentHeight = window.innerHeight - topbarHeight - toolbarHeight;

      this.contentHeight = contentHeight
      this.processContent()
    },
    addMarker ({ kind, from, to, text, action }) {
      const markerElm = document.createElement('span')
      markerElm.appendChild(document.createTextNode(text))
      markerElm.className = 'CodeMirror-buttonmarker'
      markerElm.addEventListener('click', action)
      this.cm.markText(from, to, { replacedWith: markerElm, __kind: kind })
    },
    async pageMoveRename ({ path, locale }) {
      this.$store.commit(`loadingStart`, 'page-move')
      try {
        const resp = await this.$apollo.mutate({
          mutation: movePageMutation,
          variables: {
            id: this.$store.get('page/id'),
            destinationLocale: locale,
            destinationPath: path
          }
        })
        if (_.get(resp, 'data.pages.move.responseResult.succeeded', false)) {
          window.location.replace(`/${locale}/${path}`)
        } else {
          throw new Error(_.get(resp, 'data.pages.move.responseResult.message', this.$t('common:error.unexpected')))
        }
      } catch (err) {
        this.$store.commit('pushGraphError', err)
        this.$store.commit(`loadingStop`, 'page-move')
      }
    },
    goToPreview () {
      this.viewMode = 'preview'
    },
    goToEdit () {
      this.viewMode = 'edit'
    },
    goToSettings () {
      this.viewMode = 'settings'
    },
    pageMove () {
      this.movePageModal = true
    },
    goToSettingSection (sectionId) {
      const section = document.getElementById(sectionId);
      section.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  },
  mounted() {
    // previewRenderer.init(md, {})
    videoRenderer.init(md, {})


    this.$store.set('editor/editorKey', 'markdown')

    if (this.mode === 'create' && !this.$store.get('editor/content')) {
      this.$store.set('editor/content', '# Header\nYour content here')
    }

    this.$root.$on('resetEditorConflict', () => {
      this.isConflict = false
    })

    // Initialize Mermaid API
    mermaid.initialize({
      startOnLoad: false,
      theme: this.$vuetify.theme.dark ? `dark` : `default`
    })

    // Initialize CodeMirror

    this.cm = CodeMirror.fromTextArea(this.$refs.cm, {
      tabSize: 2,
      mode: 'text/markdown',
      theme: 'wikijs-light',
      lineNumbers: true,
      lineWrapping: true,
      line: true,
      styleActiveLine: true,
      highlightSelectionMatches: {
        annotateScrollbar: true
      },
      // viewportMargin: 50,
      inputStyle: 'contenteditable',
      allowDropFileTypes: ['image/jpg', 'image/png', 'image/svg', 'image/jpeg', 'image/gif'],
      direction: siteConfig.rtl ? 'rtl' : 'ltr',
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
    })
    this.cm.setValue(this.$store.get('editor/content'))
    this.cm.on('change', c => {
      this.$store.set('editor/content', c.getValue())
      this.onCmInput(this.$store.get('editor/content'))
    })
    // size of the editor

    // if (this.$vuetify.breakpoint.mdAndUp) {
    //   this.cm.setSize(null, 'calc(100vh - 112px - 24px)')
    // } else {
    //   this.cm.setSize(null, 'calc(100vh - 112px - 16px)')
    // }

    // Set Keybindings

    const keyBindings = {
      'F11' (c) {
        c.setOption('fullScreen', !c.getOption('fullScreen'))
      },
      'Esc' (c) {
        if (c.getOption('fullScreen')) c.setOption('fullScreen', false)
      }
    }
    _.set(keyBindings, `${CtrlKey}-S`, c => {
      this.save()
      return false
    })
    _.set(keyBindings, `${CtrlKey}-B`, c => {
      this.toggleMarkup({ start: `**` })
      return false
    })
    _.set(keyBindings, `${CtrlKey}-I`, c => {
      this.toggleMarkup({ start: `*` })
      return false
    })
    _.set(keyBindings, `${CtrlKey}-Alt-Right`, c => {
      let lvl = this.getHeaderLevel(c)
      if (lvl >= 6) { lvl = 5 }
      this.setHeaderLine(lvl + 1)
      return false
    })
    _.set(keyBindings, `${CtrlKey}-Alt-Left`, c => {
      let lvl = this.getHeaderLevel(c)
      if (lvl <= 1) { lvl = 2 }
      this.setHeaderLine(lvl - 1)
      return false
    })
    this.cm.setOption('extraKeys', keyBindings)

    this.cm.on('inputRead', this.autocomplete)

    // Handle cursor movement

    this.cm.on('cursorActivity', c => {
      this.positionSync(c)
      // this.scrollSync(c)
    })

    // Handle special paste

    this.cm.on('paste', this.onCmPaste)

    // Render initial preview

    // const initialPreviewRender = cheerio.load(md.render(this.$store.get('editor/content')));
    // const pageTexts = initialPreviewRender('#page-text');
    // initialPreviewRender('#presentationVideo, #slides-options, .title-container, #page-text').remove();
    // initialPreviewRender('#page-content').append(pageTexts.html())
    //
    // initialPreviewRender('#page-content, #page-slides').css('height', contentHeight + 'px')
    // initialPreviewRender('#page-content, #page-slides').css('overflow', 'scroll')
    //
    // initialPreviewRender('#page-content').css('display', 'none')
    // initialPreviewRender('#page-content').css('flex', '0')
    //
    // initialPreviewRender('#page-slides').css('display', 'block')
    // initialPreviewRender('#page-slides').css('flex', '1')

    this.processContent(this.$store.get('editor/content'))
    this.resizeComponents() // this call needs to be there because we need to populate 'cm' first so the default value for the 'newContent' argument is not null
    window.addEventListener('resize', this.resizeComponents)
    this.refresh()

    const pageContent = document.getElementById('page-content');
    console.log('pageContent after inital render: ', pageContent);

    this.$root.$on('editorInsert', opts => {
      switch (opts.kind) {
        case 'IMAGE':
          let img = `![${opts.text}](${opts.path})`
          if (opts.align && opts.align !== '') {
            img += `{.align-${opts.align}}`
          }
          this.insertAtCursor({
            content: img
          })
          break
        case 'BINARY':
          this.insertAtCursor({
            content: `[${opts.text}](${opts.path})`
          })
          break
        case 'VIDEO':
          const cursor = this.cm.doc.getCursor()
          cursor.line = this.cm.display.viewTo
          this.cm.doc.replaceRange(opts.text, cursor)
          break
        case 'DIAGRAM':
          const selStartLine = this.cm.getCursor('from').line
          const selEndLine = this.cm.getCursor('to').line + 1
          this.cm.doc.replaceSelection('```diagram\n' + opts.text + '\n```\n', 'start')
          this.processMarkers(selStartLine, selEndLine)
          break
      }
    })

    // Handle save conflict
    this.$root.$on('saveConflict', () => {
      this.toggleModal(`editorModalConflict`)
    })
    this.$root.$on('overwriteEditorContent', () => {
      this.cm.setValue(this.$store.get('editor/content'))
    })
  },
  beforeDestroy() {
    this.$root.$off('editorInsert')
    this.$root.$off('editorUpdate')
  }
}
</script>

<style lang='scss'>
@import "../../scss/joan-styles.scss";

$editor-height: calc(100vh - 112px - 24px);
$editor-height-mobile: calc(100vh - 112px - 16px);

.activeView path {
  fill: $orange;
}

.v-btn {
  letter-spacing: normal;
}

.editor-markdown {
  &-main {
    display: flex;
    width: 100%;

    & .editor-title-input input {
      text-align: left;
      font-size: 2.2rem;
    }
  }

  &-editor {
    background-color: white;
    display: block;
    border-right: 1px solid $gray-300;
    padding: 1em 3em 1em 3.4em;
    height: $editor-height;
    position: relative;
    overflow: scroll;

    .editor-title-container {
      border-bottom: 1px solid $gray-300;
      display: flex;
      align-items: center;

      &::before {
        content: '#';
        font-size: 2.2rem;
        margin: -1em 0.6em -1em 0;
        display: block;
      }
    }

    .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot {
      padding: 0;
    }

    .theme--light.v-text-field--solo > .v-input__control > .v-input__slot {
      background-color: white;
      font-weight: 600;
    }

    .v-text-field.v-text-field--solo .v-input__control {
      min-height: 0;
    }

    .v-text-field--full-width > .v-input__control > .v-input__slot {
      min-height: 0;
    }

    @include until($tablet) {
      height: $editor-height-mobile;
    }
  }

  &-preview {
    // background-color: mc('grey', '100');
    position: relative;
    // height: $editor-height;
    overflow: scroll;
    // padding: 3.4em;

    @at-root .theme--dark & {
      background-color: mc('grey', '900');
    }

    @include until($tablet) {
      display: none;
    }

    &-enter-active, &-leave-active {
      transition: max-width .5s ease;
      max-width: 50vw;

      .editor-code-preview-content {
        width: 50vw;
        overflow:hidden;
      }
    }
    &-enter, &-leave-to {
      max-width: 0;
    }

    // the spellchecker div

    & > div {
      display: flex;
      width: 100%;

      & > #page-content {
        display: none;
        flex: 0;
      }

      & > #page-content.is-preview-mode {
        display: block;
        overflow: scroll;
        flex: .75;
        border-right: 1px solid $gray-300;
        padding: 1em 3em 1em 3.4em;
      }


      & > #page-slides {
        flex: 1;
        padding-left: 2em;
        padding: 1em 3.4em 1em 2em;
        overflow: scroll;
        display: flex;
        flex-direction: column;
        gap: 1.7em;

        .slide {
          width: 100%
        }
        & img {
          width: 100%
        }

        &.is-preview-mode {
          flex: .25;
          overflow: scroll;
        }
      }


    }

    &-content {
      // height: $editor-height;
      // overflow-y: scroll;
      padding: 0;
      width: calc(100% + 17px);
      // -ms-overflow-style: none;

      // &::-webkit-scrollbar {
      //   width: 0px;
      //   background: transparent;
      // }

      @include until($tablet) {
        height: $editor-height-mobile;
      }

      > div {
        outline: none;
      }

      p.line {
        overflow-wrap: break-word;
      }

      .tabset {
        background-color: mc('teal', '700');
        color: mc('teal', '100') !important;
        padding: 5px 12px;
        font-size: 14px;
        font-weight: 500;
        border-radius: 5px 0 0 0;
        font-style: italic;

        &::after {
          display: none;
        }

        &-header {
          background-color: mc('teal', '500');
          color: #FFF !important;
          padding: 5px 12px;
          font-size: 14px;
          font-weight: 500;
          margin-top: 0 !important;

          &::after {
            display: none;
          }
        }

        &-content {
          border-left: 5px solid mc('teal', '500');
          background-color: mc('teal', '50');
          padding: 0 15px 15px;
          overflow: hidden;

          @at-root .theme--dark & {
            background-color: rgba(mc('teal', '500'), .1);
          }
        }
      }
    }
  }

  &-page-settings {
    display: flex;
    width: 100%;

    & .v-dialog__container {
      display: fixed;
    }

    & .page-settings-menu {
      flex: .20;
      height: 100%;
      overflow: scroll;
    }
    & .page-settings-content {
      flex: .80;
      height: 100%;
      border-left: 1px solid $gray-300;
      padding: 3em 8em;
      overflow: scroll;

      & .settings-section {
        border: 1px solid $gray-300;
      }

      & h2 {
        border-bottom: 1px solid $gray-300;
      }

      & .input-container, h2 {
        padding: 1em;

      }

      & .input-container {

        & label {
          display: block;
        }

        & .d-flex {
          gap: 2em;
        }

        & input {
          display: block;
          width: 100%;
          background-color: $gray-300;
          padding: .9em;
          border-radius: 5px;
          flex: .85;
        }

        & .v-btn {
          flex: .15;
          height: 100%;
          padding: .9em;
          background-color: $gray-300;
          cursor: pointer;
          text-transform: none;
          font-weight: 400;
        }

      }

      & .input-container + .input-container {
        border-top: 1px solid $gray-300;
      }

      & section + section {
        margin-top: 1em;
      }
    }
  }

  // editor icons

  .v-btn.save-btn span {
    text-transform: none;
    margin-right: 1em;
  }

  .theme--dark.v-btn.v-btn--icon{
    color: $gray-700;
  }

  & .theme--light.v-sheet {
    border-bottom: 1px solid $gray-300;
  }

  &-toolbar {
    & .v-btn.heading-dropdown {
      text-transform: none;
      font-weight: 700;
    }

    & .v-btn.heading-dropdown::before {
      background-color: transparent
    }

    .v-toolbar__content {
      padding: 0 3.3em;

      @include until($tablet) {
        padding-left: 8px;
      }
    }
  }

  &-insert:not(.v-speed-dial--right) {
    @include from($tablet) {
      left: 50%;
      margin-left: -28px;
    }
  }

  &-sidebar {
    background-color: mc('grey', '900');
    width: 64px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 24px 0;

    @include until($tablet) {
      padding: 12px 0;
      width: 40px;
    }
  }

  &-sysbar {
    padding-left: 0;

    &-locale {
      background-color: rgba(255,255,255,.25);
      display:inline-flex;
      padding: 0 12px;
      height: 24px;
      width: 63px;
      justify-content: center;
      align-items: center;
    }
  }

  // ==========================================
  // Fix FAB revealing under codemirror
  // ==========================================

  .speed-dial--fixed {
    z-index: 8;
  }

  // ==========================================
  // CODE MIRROR
  // ==========================================

  .CodeMirror {
    height: auto;
    font-family: 'Roboto Mono', monospace;
    font-size: .9rem;

    &-gutters {
      background-color: white;
    }
    &-linenumber {
      color: $gray-500;
      padding: 0;
      text-align: left;
    }
    .cm-header-1 {
      font-size: 1.5rem;
    }
    .cm-header-2 {
      font-size: 1.25rem;
    }
    .cm-header-3 {
      font-size: 1.15rem;
    }
    .cm-header-4 {
      font-size: 1.1rem;
    }
    .cm-header-5 {
      font-size: 1.05rem;
    }
    .cm-header-6 {
      font-size: 1.025rem;
    }
  }

  .CodeMirror-wrap pre.CodeMirror-line, .CodeMirror-wrap pre.CodeMirror-line-like {
    word-break: break-word;
  }

  .CodeMirror-focused .cm-matchhighlight {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
    background-position: bottom;
    background-repeat: repeat-x;
  }
  .cm-matchhighlight {
    background-color: mc('grey', '800');
  }
  .CodeMirror-selection-highlight-scrollbar {
    background-color: mc('green', '600');
  }
}

// HINT DROPDOWN

.CodeMirror-hints {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;

  margin: 0;
  padding: 1px;

  box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  border: 1px solid mc('grey', '700');

  background: mc('grey', '900');
  font-family: 'Roboto Mono', monospace;
  font-size: .9rem;

  max-height: 150px;
  overflow-y: auto;

  min-width: 250px;
  max-width: 80vw;
}

.CodeMirror-hint {
  margin: 0;
  padding: 0 4px;
  white-space: pre;
  color: #FFF;
  cursor: pointer;
}

li.CodeMirror-hint-active {
  background: mc('blue', '500');
  color: #FFF;
}
#page-slides {
  flex: .2;
}
    // & #page-slides {
    //   position: relative;
    //   height: 100%;
    //   overflow: scroll;
    //   display: flex;
    //   flex-direction: column;
    //   gap: 1.7em;
    // }
</style>
