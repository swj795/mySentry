import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import mysentry from '../../core/src/index'

import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin' //插件
import 'highlight.js/styles/vs2015.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(hljsVuePlugin)
app.use(mysentry, {
  reportUrl: '/addError',
  apikey: 'abcd'
})

app.mount('#app')
