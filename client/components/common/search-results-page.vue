<template lang="pug">
  v-app.overflow-hidden.fill-height(:dark='$vuetify.theme.dark', :class='$vuetify.rtl ? `is-rtl` : `is-ltr`')
    nav-header(v-if='!printView', ref='navHeaderRef')
    v-main.overflow-hidden.fill-height(ref='content')
      v-row.no-gutters.overflow-y-hidden.fill-height
        v-drag-col.col-12.col.fill-height.pa-0.ma-0#toc-drager(
          ref='dragCol'
          height="100%"
          width="100%"
          :leftPercent='15'
          :sliderWidth='10'
          sliderColor='transparent'
          sliderHoverColor='#FF6B00'
          sliderBgColor='transparent'
          sliderBgHoverColor='#FAFAFA'
          )
          template(#left)
            v-col.pl-13.overflow-y-hidden.fill-height
              <!-- nav sidebar -->
              nav-sidebar(:items='sidebarDecoded', :nav-mode='navMode')
              <!-- toc -->
              v-list.menu.overflow-y-hidden(v-if="tocItems.length", expand=true)
                v-list-group#main-menu-toggler.fill-height(active-class="active-group", value="Content")
                  template(v-slot:activator)
                    v-list-item-content
                      v-list-item-title.main-menu-title Table of contents
                  v-list.pl-2
                    .main-menu(v-for='(item, idx) of tocItems', :key="'toc-item'+idx")
                      v-list-item(:href="'#'+item.id")
                        icon(name="document")
                        v-list-item-title {{ item.title }}
          template(#right)
            v-drag-col.fill-height.pa-0.col-12.col.ma-0#results-drager(
              ref='dragCol'
              height="100%"
              width="100%"
              :leftPercent='70'
              :sliderWidth='10'
              sliderColor='transparent'
              sliderHoverColor='#FF6B00'
              sliderBgColor='transparent'
              sliderBgHoverColor='#FAFAFA'
              )
              template(#left)
                v-col.px-6.overflow-y-hidden.fill-height
                  v-tabs
                    v-tabs-slider(color='#FF6B00')
                    v-tab
                      icon(name='search')
                      span Search
                    v-tab
                      icon(name='chat')
                      span Chat
                  .correction.my-5
                    p.corrected-input.font-weight-bold Showing results for 
                      span Voice Clue
                    p.user-input Search instead for 
                      em.font-weight-bold Voizw Clue
                  article.d-flex.flex-column.about.px-8.py-6(style='gap: 15px')
                    h2.ma-0 About Voice Clue Project
                    v-divider
                    .about-description.ma-0.py-2.px-3
                      p Original name of the team is VM2. Voice Clue team consists of three people:  Srinath, Sande, Siddique and author of the video - Gayathri, who is  currently a third year undergrad at Andhra University College of Engineering.
                      p I hope this helps. Let me know if you have any other questions.
                    // this should be dinamycally generated
                    .d-flex.align-center(style='gap: 10px')
                      span.sources-label Learn more:
                      div
                        v-btn.source-link.d-flex(href='#', depressed, small)
                          icon.mr-1(name="document", size="15")
                          span Link 1
                      div
                        v-btn.source-link.d-flex(href='#', depressed, small)
                          icon.mr-1(name="document", size="15")
                          span Link 2
                      div
                        v-btn.source-link.d-flex(href='#', depressed, small)
                          icon.mr-1(name="document", size="15")
                          span Link 3
                    v-text-field(
                      ref='questionField',
                      v-model='question',
                      label='Ask anything',
                      single-line,
                      solo
                      flat
                      hide-details,
                      @keyup.enter='questionEnter'
                      autocomplete='none'
                    )
                    .d-flex.align-center(style='gap: 10px')
                      icon(name="chat")
                      div
                        v-btn.source-link.d-flex(href='#', depressed, small)
                          icon.mr-1(name="document", size="15")
                          span Question 1
                      div
                        v-btn.source-link.d-flex(href='#', depressed, small)
                          icon.mr-1(name="document", size="15")
                          span Question 2
                    .h3.font-weight-bold You may be interested in:
                    v-divider
                    p.ma-0 Can I create my own AI voice?
                    v-divider
                    p.ma-0 How does AI remove vocals?
                    v-divider
                  section.qna.px-8.py-6.mt-6
                    h2.mb-8 Questions for search topics
                    .d-flex.flex-column(style='gap: 30px')
                      article(v-for='(qna, idx) of JSON.parse(results).qnas')
                        h3 {{ qna.question }}
                        v-divider.my-2
                        p.clamped-2 {{ qna.answer }}
                        .d-flex.align-center(style='gap: 10px')
                          span.sources-label Learn more:
                          div(v-for='(link, idx) of qna.links')
                            v-btn.source-link.d-flex(:href='link', depressed, small)
                              icon.mr-1(name="document", size="15")
                              span {{ getTitleFromPath(link) }}
                  section.d-flex.flex-column.px-8.py-6(style='gap: 15px')
                    article.qna-result(v-for='(qnar, idx) of qnasResults', :id="qnar.id")
                      .d-flex
                        icon.mr-2(name="document")
                        h3 {{ qnar.title }}
                      a(:href='qnar.path')
                        small {{ qnar.path }}
                      p.clamped-2(v-for='(text, idx) of qnar.text_blocks') {{ text }}
              template(#right)
                v-col.overflow-y-hidden.fill-height(style='background-color: peachpuff')
</template>

<script>
import { get, sync } from 'vuex-pathify'
import Icon from '../icon'
import NavSidebar from '../../themes/default/components/nav-sidebar';
import Vue from 'vue'
import _ from 'lodash'
import { DragCol } from 'vue-resizer'

Vue.component('VDragCol', DragCol)

export default {
  data () {
    return {
      question: ''
    }
  },
  props: {
    results: {
      type: String,
      default: {}
    },
    sidebar: {
      type: String,
      default: ''
    },
    navMode: {
      type: String,
      default: 'TREE'
    },
  },
  components: {
    Icon,
    NavSidebar,
  },
  methods: {
    getNavHeaderOffset () {
      const { navHeaderRef } = this.$refs;
      return navHeaderRef
    },
    getTitleFromPath (path) {
      const lastSlashIdx = path.lastIndexOf('/');
      const firstHashIdx = path.indexOf('#');
      const title = path.slice(lastSlashIdx + 1, firstHashIdx)
      return title.replaceAll('-', ' ')
    }
  },
  computed: {
    printView: sync('site/printView'),
    tocItems() {
      const parsedResults = JSON.parse(this.results);
      // return Object.keys(parsedResults).length ? parsedResults.qnas_results.map(r => r.title) : []
      if (Object.keys(parsedResults).length) {
        return parsedResults.qnas_results.map(r => ({
          title: r.title,
          id: _.kebabCase(r.title)
        }))
      } else {
        return []
      };
    },
    qnasResults() {
      const parsedResults = JSON.parse(this.results);
      if (Object.keys(parsedResults).length && parsedResults.qnas_results) {
        return parsedResults.qnas_results.map(r => ({
          ...r,
          id: _.kebabCase(r.title)
        }))
      } else {
        return []
      };
    },
    sidebarDecoded() {
      return JSON.parse(Buffer.from(this.sidebar, 'base64').toString())
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../scss/joan-styles.scss";

html, body,#root, #app{margin: 0; height: 100%; overflow: hidden}
h2 { font-size: 18px; }
h3 { font-size: 16px; }
p {
  margin: 0px;
}
p+p {
  margin-top: 16px;
  margin-bottom: 0px;
}

* { letter-spacing: normal; }

#toc-col {
  // border-right: 1px solid $gray-300;
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  #content-toggler {
    & .v-list-group__items {
      min-width: 0;
      overflow: auto;
      height: 100%;
    }
    .v-list-group__header {
      border-bottom: 1px solid $gray-300;
      border-radius: 0;
      min-height: 44px;
      padding-top: 1em;

      .toc-header{
        font-size: 1.11rem;
        font-weight: 600;
        padding-bottom: 0;
        color: black;
      }
      .v-list-group__header__append-icon{
        color: black;
      }
    }
  }
}

.clamped-2 {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical; // WARNING: non-standar feature
  overflow: hidden;
}

.correction {
  display: flex;
  flex-direction: column;
  gap: 5px;

  p {
    margin: 0;
  }

  .corrected-input span { color: $orange }
}

.v-tabs {
  .v-tab {
    text-transform: capitalize;
    gap: 10px;
    padding: 0;
    color: black;
  }
  .v-slide-group__content {
    gap: 20px;
    background-color: blue;
  }
}
.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) {
  color: black;
}

section.qna, article.about, .about-description, .v-text-field {
  border: 1px solid $gray-300;
  border-radius: 10px;
}

.about-description {
  border-radius: 5px;
  background-color: $gray-100;
}

.v-text-field {
  border-radius: 5px;
}

.sources-label {
  font-size: 14px;
}
.source-link {
  border: 1px solid black $gray-300;
  text-transform: capitalize;
}

.qna-result {
  a {
    color: black;
    text-decoration: none;
  }
}
</style>
