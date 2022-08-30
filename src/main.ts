import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import App from './App.vue'

import './style.scss'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus, { size: 'normal', locale: en })
app.mount('#app')