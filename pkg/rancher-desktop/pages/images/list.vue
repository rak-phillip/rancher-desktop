<script>
import _ from 'lodash';

import { State as K8sState } from '@pkg/backend/backend';
import Images from '@pkg/components/Images.vue';
import { ipcRenderer } from '@pkg/utils/ipcRenderer';

export default {
  name:       'images-list',
  components: { Images },
  data() {
    return {
      images:          [],
      imageNamespaces: [],
    };
  },
  computed: {
    state() {
      if (![K8sState.STARTED, K8sState.DISABLED].includes(this.k8sState)) {
        return 'IMAGE_MANAGER_UNREADY';
      }

      return this.imageManagerState ? 'READY' : 'IMAGE_MANAGER_UNREADY';
    },
  },
  mounted() {
    ipcRenderer.on('images-changed', (event, images) => {
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
      // TODO: Use a specific message to indicate whether messages are supported or not.
      this.imageNamespaces = namespaces;
      this.supportsNamespaces = namespaces.length > 0;
      this.checkSelectedNamespace();
    });
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
