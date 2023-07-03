<template lang="pug">
  div
    .d-flex(v-if='navMode === `MIXED`')
    <!-- Custom Navigation -->
    v-list(v-if='currentMode === `custom`', dense, :class='color', :dark='dark')
      template(v-for='item of items')
        v-list-item(
          v-if='item.k === `link`'
          :href='item.t'
          :target='item.y === `externalblank` ? `_blank` : `_self`'
          :rel='item.y === `externalblank` ? `noopener` : ``'
          )
          v-list-item-avatar(size='24', tile)
            v-icon(v-if='item.c.match(/fa[a-z] fa-/)', size='19') {{ item.c }}
            v-icon(v-else) {{ item.c }}
          v-list-item-title {{ item.l }}
        v-divider.my-2(v-else-if='item.k === `divider`')
        v-subheader.pl-4(v-else-if='item.k === `header`') {{ item.l }}
    <!-- Browse -->
    v-list.menu(v-else-if='currentMode === `browse`', subheader )
      v-list-group#main-menu-toggler(active-class="active-group")
        template(v-slot:activator)
          v-list-item-content
            v-list-item-title.main-menu-title Pages
        v-list
          .main-menu(v-for='(rootDoc, idx) of docStructure.filter(d => !d.isFolder)')
            v-list-item(:href='`/` + rootDoc.locale + `/` + rootDoc.path', :key='`childpage-l0-` + rootDoc.id', :input-value='path === rootDoc.path')
              icon(name="page")
              v-list-item-title {{ rootDoc.title }}
          v-list-group.main-menu-parents(
            v-for='(parent, idx) of docStructure.filter(d => d.isFolder)'
            :key='`list-group-` + idx'
            prepend-icon="mdi-folder"
            v-model="parent.active"
            active-class="active-group"
          )
            template(v-slot:activator)
              v-list-item-content
                v-list-item-title {{ parent.title.split('-').map(s => s[0].toUpperCase() + s.substring(1)).join(' ') }}
            template(v-if="parent.children")
              v-list-item(v-for="child of parent.children.data.pages.tree", :key="'child' + child.id" :href='`/` + child.locale + `/` + child.path')
                icon(name="page")
                v-list-item-title {{ child.title }}
</template>

<script>
import _ from 'lodash'
import gql from 'graphql-tag'
import { get } from 'vuex-pathify'
import Icon from '../../../components/icon'

/* global siteLangs */

export default {
  components: {
    Icon
  },
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    dark: {
      type: Boolean,
      default: true
    },
    items: {
      type: Array,
      default: () => []
    },
    navMode: {
      type: String,
      default: 'MIXED'
    }
  },
  data() {
    return {
      currentMode: 'browse',
      currentItems: [],
      docStructure: [],
      currentParent: {
        id: 0,
        title: '/ (root)'
      },
      parents: [],
      loadedCache: []
    }
  },
  computed: {
    path: get('page/path'),
    locale: get('page/locale')
  },
  methods: {
    switchMode (mode) {
      this.currentMode = mode
      window.localStorage.setItem('navPref', mode)
      if (mode === `browse` && this.loadedCache.length < 1) {
        this.loadFromCurrentPath()
      }
    },
    async fetchRootItems () {
      const root = {
        id: 0,
        title: '/ (root)'
      }
      const rootDocuments = await this.$apollo.query({
        query: gql`
          query ($parent: Int, $locale: String!) {
            pages {
              tree(parent: $parent, mode: ALL, locale: $locale) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          parent: root.id,
          locale: this.locale
        }
      })
      await rootDocuments.data.pages.tree.forEach(async item => {
        if (item.isFolder) {
          const children = await this.$apollo.query({
            query: gql`
              query ($parent: Int, $locale: String!) {
                pages {
                  tree(parent: $parent, mode: ALL, locale: $locale) {
                    id
                    path
                    title
                    isFolder
                    pageId
                    parent
                    locale
                  }
                }
              }
            `,
            fetchPolicy: 'cache-first',
            variables: {
              parent: item.id,
              locale: this.locale
            }
          })
          Object.defineProperty(item, 'children', {
            get: function () { return children }
          })
        };
      })
      this.loadedCache = _.union(this.loadedCache, [root.id])
      this.docStructure = _.get(rootDocuments, 'data.pages.tree', [])
      // this.currentItems = _.get(rootDocuments, 'data.pages.tree', [])
      this.$store.commit(`loadingStop`, 'browse-load')
    },
    async fetchBrowseItems (item) {
      this.$store.commit(`loadingStart`, 'browse-load')
      if (!item) {
        item = this.currentParent
      }

      if (this.loadedCache.indexOf(item.id) < 0) {
        this.currentItems = []
      }

      if (item.id === 0) {
        this.parents = []
      } else {
        const flushRightIndex = _.findIndex(this.parents, ['id', item.id])
        if (flushRightIndex >= 0) {
          this.parents = _.take(this.parents, flushRightIndex)
        }
        if (this.parents.length < 1) {
          this.parents.push(this.currentParent)
        }
        this.parents.push(item)
      }

      this.currentParent = item

      const resp = await this.$apollo.query({
        query: gql`
          query ($parent: Int, $locale: String!) {
            pages {
              tree(parent: $parent, mode: ALL, locale: $locale) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          parent: item.id,
          locale: this.locale
        }
      })
      this.loadedCache = _.union(this.loadedCache, [item.id])
      this.currentItems = _.get(resp, 'data.pages.tree', [])
      this.$store.commit(`loadingStop`, 'browse-load')
    },
    async loadFromCurrentPath() {
      this.$store.commit(`loadingStart`, 'browse-load')
      const resp = await this.$apollo.query({
        query: gql`
          query ($path: String, $locale: String!) {
            pages {
              tree(path: $path, mode: ALL, locale: $locale, includeAncestors: true) {
                id
                path
                title
                isFolder
                pageId
                parent
                locale
              }
            }
          }
        `,
        fetchPolicy: 'cache-first',
        variables: {
          path: this.path,
          locale: this.locale
        }
      })
      const items = _.get(resp, 'data.pages.tree', [])
      const curPage = _.find(items, ['pageId', this.$store.get('page/id')])
      if (!curPage) {
        console.warn('Could not find current page in page tree listing!')
        return
      }

      let curParentId = curPage.parent
      let invertedAncestors = []
      while (curParentId) {
        const curParent = _.find(items, ['id', curParentId])
        if (!curParent) {
          break
        }
        invertedAncestors.push(curParent)
        curParentId = curParent.parent
      }

      this.parents = [this.currentParent, ...invertedAncestors.reverse()]
      this.currentParent = _.last(this.parents)

      this.loadedCache = [curPage.parent]
      this.currentItems = _.filter(items, ['parent', curPage.parent])
      this.$store.commit(`loadingStop`, 'browse-load')
    },
    goHome () {
      window.location.assign(siteLangs.length > 0 ? `/${this.locale}/home` : '/')
    }
  },
  mounted () {
    this.currentParent.title = `/ ${this.$t('common:sidebar.root')}`
    if (this.navMode === 'TREE') {
      this.currentMode = 'browse'
    } else if (this.navMode === 'STATIC') {
      this.currentMode = 'custom'
    } else {
      this.currentMode = window.localStorage.getItem('navPref') || 'custom'
    }
    if (this.currentMode === 'browse') {
      // this.loadFromCurrentPath()
      this.fetchRootItems()
    }
  }
}
</script>
<style lang="scss">
@import '../../../scss/joan-styles.scss';
#app {
.main-menu-parents .v-list-item, .main-menu .v-list-item {
  padding: 0;
  margin: 0;
}
.main-menu-parents {
  & a svg {
    margin-left: 1em;
  }
}
.main-menu, .main-menu-parents {
  & a {
    margin-left: .7em;
    & svg {
      margin-right: .7em;
    }
  }

  & .v-list-group__header__prepend-icon {
    margin-right: 0;
  }
}
.v-application--is-ltr .v-list-item__icon:first-child {
  margin-right: .7em;
}

#main-menu-toggler {
  & > .v-list-item {
    padding: 0;
  }

  & > .v-list-item__content {
    padding: 0
  }
>.v-list-group__header {
    border-bottom: 1px solid $gray-300;
    border-radius: 0;
    min-height: 44px;
    .toc-header{
      font-size: 1.11rem;
      font-weight: 600;
      padding-bottom: 0;
      color: black;
    }
    .v-list-item__content {
       padding: 0 8px;
    }
    .v-list-group__header__append-icon{
      color: black;
       padding: 0 8px;
    }
  }
}
.menu .v-list-item--active {
  // background-color: $gray-200;
  color: black;
  &:hover {
    background-color: transparent;

  }
}
.main-menu-title {
  font-size: 1.11rem;
  font-weight: 600;
}
}
</style>
