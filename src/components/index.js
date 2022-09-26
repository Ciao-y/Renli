
// 辅助所有全局自定义组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from '@/components/ScreenFull'
import ThemePicker from './ThemPicker'
import lang from './lang/index.vue'
import TagView from './TagsView/index.vue'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('lang', lang)
    Vue.component('TagView', TagView)
    Vue.use(Print)
  }
}
