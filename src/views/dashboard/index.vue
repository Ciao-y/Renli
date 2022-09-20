<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}
      <qrcode-vue :value="value" :size="size" level="H" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QrcodeVue from 'qrcode.vue'
export default {
  name: 'Dashboard',
  components: {
    QrcodeVue
  },
  data() {
    return {
      value: 'https://example.com',
      size: 300
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
