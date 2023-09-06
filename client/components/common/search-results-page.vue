<template lang="pug">
  v-app.overflow-hidden.fill-height(:dark='$vuetify.theme.dark', :class='$vuetify.rtl ? `is-rtl` : `is-ltr`')
    nav-header(v-if='!printView', ref='navHeaderRef')
    v-row.no-gutters.overflow-y-hidden.fill-height
      v-col(cols=2, style='background-color: orange')
      v-col.px-6(cols=7, style='padding-top: 100px')
        v-tabs
          v-tabs-slider(color='#FF6B00')
          v-tab
            icon(name='search')
            span Search
          v-tab
            icon(name='chat')
            span Chat
        .correction.my-5
          p.corrected-input Showing results for 
            span Voice Clue
          p.user-input Search instead for 
            em Voizw Clue
        section.qna.px-8.py-6
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
          article.qna-result(v-for='(qnar, idx) of JSON.parse(results).qnas_results')
            .d-flex
              icon.mr-2(name="document")
              h3 {{ qnar.title }}
            a(:href='qnar.path')
              small {{ qnar.path }}
            p.clamped-2(v-for='(text, idx) of qnar.text_blocks') {{ text }}
      v-col(cols=3, style='background-color: peachpuff')
</template>

<script>
import { get, sync } from 'vuex-pathify'
import Icon from '../icon'

export default {
  props: {
    results: {
      type: String,
      default: {}
    }
  },
  components: {
    Icon
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
  },
}
</script>

<style lang="scss" scoped>
@import "../../scss/joan-styles.scss";

h2 { font-size: 18px; }
h3 { font-size: 16px; }

* { letter-spacing: normal; }

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

section.qna {
  border: 1px solid $gray-300;
  border-radius: 10px;
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
