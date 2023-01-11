<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import { State as K8sState } from '@pkg/backend/backend';
import Images from '@pkg/components/Images.vue';
import { defaultSettings } from '@pkg/config/settings';
import { ipcRenderer } from '@pkg/utils/ipcRenderer';

export default {
  name:       'images-list',
  components: { Images },
  data() {
    return {
      images:             [],
      imageNamespaces:    [],
      settings:           defaultSettings,
      supportsNamespaces: true,
    };
  },
  computed: {
    ...mapGetters('k8sManager', { k8sState: 'getK8sState' }),
    ...mapGetters('imageManager', { imageManagerState: 'getImageManagerState' }),
    state() {
      if (![K8sState.STARTED, K8sState.DISABLED].includes(this.k8sState)) {
        return 'IMAGE_MANAGER_UNREADY';
      }

      return this.imageManagerState ? 'READY' : 'IMAGE_MANAGER_UNREADY';
    },
  },
  watch: {
    imageManagerState: {
      handler(state) {
        this.$store.dispatch(
          'page/setHeader',
          { title: this.t('images.title') },
        );

        if (!state) {
          return;
        }

        this.$store.dispatch(
          'page/setAction',
          { action: 'images-button-add' },
        );
      },
      immediate: true,
    },
  },
  mounted() {
    ipcRenderer.on('images-changed', (event, images) => {
      console.log('images-changed');
      if (_.isEqual(images, this.images)) {
        return;
      }

      this.images = images;

      if (this.supportsNamespaces && this.imageNamespaces.length === 0) {
        // This happens if the user clicked on the Images panel before data was ready,
        // so no namespaces were available when it initially asked for them.
        // When the data is ready, images are pushed in, but namespaces aren't.
        ipcRenderer.send('images-namespaces-read');
      }
    });

    (async() => {
      this.images = await ipcRenderer.invoke('images-mounted', true);
    })();

    ipcRenderer.on('images-namespaces', (event, namespaces) => {
      console.log('images-namespaces');
      // TODO: Use a specific message to indicate whether messages are supported or not.
      this.imageNamespaces = namespaces;
      this.supportsNamespaces = namespaces.length > 0;
      this.checkSelectedNamespace();
    });

    ipcRenderer.on('images-check-state', (event, state) => {
      console.log('images-check-state');
      this.$store.dispatch('imageManager/setImageManagerState', state);
    });

    ipcRenderer.invoke('images-check-state').then((state) => {
      console.log('images-check-state');
      this.$store.dispatch('imageManager/setImageManagerState', state);
    });

    ipcRenderer.on('settings-update', (event, settings) => {
      console.log('settings-update');
      // TODO: put in a status bar
      this.settings = settings;
      this.checkSelectedNamespace();
    });

    ipcRenderer.send('images-namespaces-read');

    ipcRenderer.on('settings-read', (event, settings) => {
      console.log('settings-read');
      this.settings = settings;
    });

    ipcRenderer.send('settings-read');
  },
  beforeDestroy() {
    ipcRenderer.invoke('images-mounted', false);
    ipcRenderer.removeAllListeners('images-mounted');
    ipcRenderer.removeAllListeners('images-changed');
  },
  methods: {
    checkSelectedNamespace() {
      if (!this.supportsNamespaces || this.imageNamespaces.length === 0) {
        // Nothing to verify yet
        return;
      }
      if (!this.imageNamespaces.includes(this.settings.images.namespace)) {
        const K8S_NAMESPACE = 'k8s.io';
        const defaultNamespace = this.imageNamespaces.includes(K8S_NAMESPACE) ? K8S_NAMESPACE : this.imageNamespaces[0];

        ipcRenderer.invoke('settings-write',
          { images: { namespace: defaultNamespace } } );
      }
    },
    onShowAllImagesChanged(value) {
      if (value !== this.settings.images.showAll) {
        ipcRenderer.invoke('settings-write',
          { images: { showAll: value } } );
      }
    },
    onChangeNamespace(value) {
      if (value !== this.settings.images.namespace) {
        ipcRenderer.invoke('settings-write',
          { images: { namespace: value } } );
      }
    },
  },
};
</script>

<template>
  <Images
    class="content"
    data-test="imagesTable"
    :images="images"
    :image-namespaces="imageNamespaces"
    :state="state"
    :show-all="settings.images.showAll"
    :selected-namespace="settings.images.namespace"
    :supports-namespaces="supportsNamespaces"
    @toggledShowAll="onShowAllImagesChanged"
    @switchNamespace="onChangeNamespace"
  />
</template>
