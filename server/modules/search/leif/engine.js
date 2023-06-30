const _ = require('lodash')
const stream = require('stream')
const Promise = require('bluebird')
const pipeline = Promise.promisify(stream.pipeline)
const fs = require('fs')
const zlib = require('zlib')

/* global WIKI */

module.exports = {
  async activate() {
    // not used
  },
  async deactivate() {
    // not used
  },
  /**
   * INIT
   */
  async init() {
    WIKI.logger.info(`(SEARCH/LEIF) Initializing...`)
    // this.client = algoliasearch(this.config.appId, this.config.apiKey)
    //this.index = this.client.initIndex(this.config.indexName)

    WIKI.logger.info(`(SEARCH/LEIF) Initialization completed.`)
  },
  /**
   * QUERY
   *
   * @param {String} q Query
   * @param {Object} opts Additional options
   */
  async query(q, opts) {
    return {
      results: [{
        id: 1,
        locale: 'en',
        path: "none",
        title: "Not implemented yet",
        description: "To be implemented"
      }],
      suggestions: [],
      totalHits: 1
    }
  },
  /**
   * CREATE
   *
   * @param {Object} page Page to create
   */
  async created(page) {

  },
  /**
   * UPDATE
   *
   * @param {Object} page Page to update
   */
  async updated(page) {

  },
  /**
   * DELETE
   *
   * @param {Object} page Page to delete
   */
  async deleted(page) {

  },
  /**
   * RENAME
   *
   * @param {Object} page Page to rename
   */
  async renamed(page) {

  },
  /**
   * REBUILD INDEX
   */
  async rebuild() {
    WIKI.logger.info(`(SEARCH/LEIF) Rebuilding Index...`)

    await pipeline(
      WIKI.models.knex.column({ id: 'hash' }, 'path', { locale: 'localeCode' }, 'title', 'description', 'render').select().from('pages').where({
        isPublished: true,
        isPrivate: false
      }).stream(),
      new stream.Transform({
        writableObjectMode: true,
        readableObjectMode: false,
        transform(obj, encoding, callback) {

          if (this.firstObjectPassed) {
            this.push(',\n');
          } else {
            this.firstObjectPassed = true;
            this.push('[');
          }
          // Convert object to JSON and add a newline
          this.push(JSON.stringify(obj));
          callback();
        },
        flush(callback) {
          this.push(']'); // Append the closing bracket only at the end
          callback();
        }
      }),
      zlib.createGzip(),
      fs.createWriteStream('output.json.gz')
    )


    WIKI.logger.info(`(SEARCH/LEIF) Index rebuilt successfully.`)
  }
}
