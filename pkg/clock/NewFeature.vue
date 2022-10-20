<script>
import { ipcRenderer } from 'electron';

import ClockComponent from './ClockComponent.vue';

export default {
  name:       'Clock',
  components: { ClockComponent },
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
    <ClockComponent size="400px" border="5px solid #2553FF" color="#777" />
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
