<template lang='pug'>
  v-card.editor-modal-video.animated.fadeInLeft(flat, tile, :class='`is-editor-` + editorKey')
    v-container.pa-3(grid-list-lg, fluid)
      v-layout(row, wrap)
        v-flex(xs12, lg12)
          v-card.radius-7.animated.fadeInLeft.wait-p1s(:light='!$vuetify.theme.dark', :dark='$vuetify.theme.dark')

            v-card.mt-3.radius-7.animated.fadeInRight.wait-p4s(:light='!$vuetify.theme.dark', :dark='$vuetify.theme.dark')
              v-card-text.pb-0
                v-toolbar.radius-7(:color='$vuetify.theme.dark ? `teal` : `teal lighten-5`', dense, flat)
                  v-icon.mr-3(:color='$vuetify.theme.dark ? `white` : `teal`') mdi-video-plus
                  .body-2(:class='$vuetify.theme.dark ? `white--text` : `teal--text`') {{ "Upload a video" }}
                  v-spacer
                v-text-field.mt-3(
                  v-model='remoteVideoUrl'
                  outlined
                  color='teal'
                  single-line
                  placeholder='example.com/video.mp4'
                )
                .d-flex
                  v-btn.px-4(color='teal', :disabled='isValidUrl(remoteVideoUrl)' @click='fetchVideo') {{$t('common:actions.fetch') /* TODO: check if valid url*/}}

              v-card-actions
                v-progress-linear.mt-5(
                  color='blue lighten-6'
                  :value='progress'
                  :buffer-value='progress'
                  rounded
                  query
                )
                span {{ progress }}
                v-spacer
                .d-flex.mt-3
                  v-btn.ml-3.mr-0.my-0.radius-7(color='red darken-2', large, @click='cancel', dark)
                    v-icon(left) mdi-close
                    span {{$t('common:actions.cancel')}}
                  v-btn.ml-3.mr-0.my-0.radius-7(color='teal', large, @click='finish', :disabled='progress < 100')
                    v-icon(left) mdi-playlist-plus
                    span {{ "Finish" }}
</template>

<script>
import { get, sync } from 'vuex-pathify'
import axios from 'axios'

export default {
  name: 'VideoTranscriber',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      progress: 0,
      text: '',
      remoteVideoUrl: ''
    }
  },
  computed: {
    editorKey: get('editor/editorKey'),
    activeModal: sync('editor/activeModal'),
    folderTree: get('editor/media@folderTree')
  },
  methods: {
    cancel () {
      this.activeModal = ''
    },
    async fetchVideo() {
      const apiUrl = 'http://franzxaver.holloway.ai'
      const auth = {
        headers: {
          'access_token': `joan`
        }
      }
      const data = {
        'url': this.remoteVideoUrl,
        'resultType': 'vmarkdown',
        'description': 'string'
      }
      const jobId = (await axios.post(`${apiUrl}/api/v1/video/`, data, auth)).data.job_id

      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access_token': `joan`,
          'responseType': 'stream'
        }
      }

      const response = await fetch(`${apiUrl}/api/v1/video/stream/${jobId}`, requestOptions)
      const stream = response.body
      const reader = stream.getReader()
      const decoder = new TextDecoder('utf-8')

      const updateProgress = (progress) => {
        this.progress = progress
      }

      const updateText = (text) => {
        this.text = `\n${text}\n`
      }

      function readStream() {
        reader.read().then(({ done, value }) => {
          if (done) {
            console.log('Stream complete')
            axios.get(`${apiUrl}/api/v1/video/${jobId}`, auth)
              .then((res) => {
                const progressObject = res.data
                console.log('response', res)
                updateText(progressObject?.vmarkdown)
                updateProgress(100)
              })
            return
          }
          // format stream value to parse it to JSON
          const valueDecoded = decoder.decode(value)
          const dataEvent = 'data: '
          valueDecoded.split('\n').forEach((msg) => {
            if (msg.startsWith(dataEvent)) {
              console.log(msg)
              try {
                const progressObject = JSON.parse(msg.slice(dataEvent.length).replace(/([^\\])\n/g, '$1\\n'))[0]
                const progressRatio = 100 / progressObject.totalAmount
                updateProgress(Math.round(progressObject.progress * progressRatio))
                if (progressObject.status === 'finished') {
                  updateProgress(100)
                }
              } catch (error) {
                console.log(error)
              }
            }
          })
          // Continue reading the stream
          readStream()
        }).catch(error => {
          console.error('Error:', error)
        })
      }
      // Start reading the stream
      readStream()
    },
    isValidUrl(string) {
      // return !(/^https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+(?:\/[^\s]*)?\.mp4$/.test(string)) // TODO: check if URL is a video
      return !this.remoteVideoUrl
    },
    finish () {
      if (this.text.length) {
        this.$root.$emit('editorInsert', {
          kind: 'VIDEO',
          text: this.text
        })
        this.activeModal = ''
      }
    }
  }
}
</script>

<style lang='scss'>
.editor-modal-video {
  position: fixed !important;
  top: 112px;
  left: 64px;
  z-index: 10;
  width: calc(100vw - 64px - 17px);
  height: calc(100vh - 112px - 24px);
  background-color: rgba(darken(mc('grey', '900'), 3%), .9) !important;
  overflow: auto;

  @include until($tablet) {
    left: 40px;
    width: calc(100vw - 40px);
    height: calc(100vh - 112px - 24px);
  }

  &.is-editor-ckeditor {
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100vh - 64px - 26px);

    @include until($tablet) {
      top: 56px;
      left: 0;
      width: 100%;
      height: calc(100vh - 56px - 24px);
    }
  }

  &.is-editor-code {
    top: 64px;
    height: calc(100vh - 64px - 26px);

    @include until($tablet) {
      top: 56px;
      height: calc(100vh - 56px - 24px);
    }
  }

  &.is-editor-common {
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100vh - 64px);

    @include until($tablet) {
      top: 56px;
      left: 0;
      width: 100%;
      height: calc(100vh - 56px);
    }
  }

  .v-btn--icon {
    padding: 0 20px;
  }

  #myProgress {
  width: 100%;
  background-color: grey;
}

  #myBar {
    width: 1%;
    height: 30px;
    background-color: green;
  }
}
</style>
