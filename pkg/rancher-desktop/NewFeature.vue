<script>
import General from '@pkg/pages/General.vue';
import { ipcRenderer } from 'electron';

export default {
  name:       'Clock',
  components: { General },
  layout:     'plain',
  methods:    {
    test() {
      ipcRenderer.invoke('show-message-box', {
        title:    'Rancher Desktop - Test Message',
        type:     'info',
        message:  'This is a test message',
        detail:   'This is some detail for a test message',
      });
    },
  },
};
</script>
<template>
  <div class="clock">
    <button
      class="btn role-primary"
      @click="test"
    >
      Test Electron
    </button>
    <general />
  </div>
</template>
<style lang="scss" scoped>
  h1 {
    text-align: center;
  }

  .clock {
    align-items: center;
    display: flex;
    justify-content: center;
  }
</style>
