
import { RouteConfig } from 'vue-router';

import defaultLayout from '@pkg/layouts/default.vue';
import DenyRoot from '@pkg/pages/DenyRoot.vue';
import Diagnostics from '@pkg/pages/Diagnostics.vue';
import Dialog from '@pkg/pages/Dialog.vue';
import FirstRun from '@pkg/pages/FirstRun.vue';
import General from '@pkg/pages/General.vue';
import Images from '@pkg/pages/Images.vue';
import KubernetesError from '@pkg/pages/KubernetesError.vue';
import LegacyIntegrationNotification from '@pkg/pages/LegacyIntegrationNotification.vue';
import PathUpdate from '@pkg/pages/PathUpdate.vue';
import PortForwarding from '@pkg/pages/PortForwarding.vue';
import Preferences from '@pkg/pages/Preferences.vue';
import SudoPrompt from '@pkg/pages/SudoPrompt.vue';
import Troubleshooting from '@pkg/pages/Troubleshooting.vue';
import UnmetPrerequisite from '@pkg/pages/UnmetPrerequisites.vue';
import ImagesAdd from '@pkg/pages/images/add.vue';
import ImagesList from '@pkg/pages/images/list.vue';
import ImagesScans from '@pkg/pages/images/scans/_image-name.vue';

const routes: RouteConfig[] = [
  {
    path:      '/rancher-desktop',
    component: defaultLayout,
    children:  [
      {
        path:     '/',
        redirect: { name: 'General' },
      },
      {
        name:      'General',
        path:      '/rancher-desktop/general',
        component: General,
      },
      {
        name:      'Port Forwarding',
        path:      '/port-forwarding',
        component: PortForwarding,
      },
      {
        path:      '/images',
        component: Images,
        children:  [
          {
            path:     '/',
            redirect: { name: 'Images' },
          },
          {
            name:      'images-add',
            path:      '/images/add',
            component: ImagesAdd,
          },
          {
            name:      'Images',
            path:      '/images-list',
            component: ImagesList,
          },
          {
            name:      'images-scans-image-name',
            path:      'images/scans/:image-name',
            component: ImagesScans,
          },
        ],
      },
      {
        name:      'Diagnostics',
        path:      '/diagnostics',
        component: Diagnostics,
      },
      {
        name:      'Troubleshooting',
        path:      '/troubleshooting',
        component: Troubleshooting,
      },
    ],
  },
  {
    name:      'Preferences',
    path:      '/preferences',
    component: Preferences,
  },
  {
    name:      'Dialog',
    path:      '/dialog',
    component: Dialog,
  },
  {
    name:      'Deny Root',
    path:      '/deny-root',
    component: DenyRoot,
  },
  {
    name:      'First Run',
    path:      '/first-run',
    component: FirstRun,
  },
  {
    name:      'Kubernetes Error',
    path:      '/kubernetes-error',
    component: KubernetesError,
  },
  {
    name:      'Legacy Integration Notification',
    path:      '/legacy-integrations',
    component: LegacyIntegrationNotification,
  },
  {
    name:      'Path Update',
    path:      '/path-update',
    component: PathUpdate,
  },
  {
    name:      'Sudo Prompt',
    path:      '/sudo-prompt',
    component: SudoPrompt,
  },
  {
    name:      'Unmet Prerequisite',
    path:      '/unmet-prerequisite',
    component: UnmetPrerequisite,
  },
];

export default routes;
