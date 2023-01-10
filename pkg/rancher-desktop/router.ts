
import { RouteConfig } from 'vue-router';

import defaultLayout from '@pkg/layouts/default.vue';
import General from '@pkg/pages/General.vue';
import Images from '@pkg/pages/Images.vue';
import PortForwarding from '@pkg/pages/PortForwarding.vue';
import Troubleshooting from '@pkg/pages/Troubleshooting.vue';

const routes: RouteConfig[] = [
  {
    name:      'rancher-desktop',
    path:      '/rancher-desktop',
    component: defaultLayout,
    children:  [
      {
        path:     '/',
        redirect: { name: 'rancher-desktop-general' },
      },
      {
        name:      'rancher-desktop-general',
        path:      '/general',
        component: General,
      },
      {
        name:      'rancher-desktop-port-forwarding',
        path:      '/port-forwarding',
        component: PortForwarding,
      },
      {
        name:      'rancher-desktop-images',
        path:      '/images',
        component: Images,
      },
      {
        name:      'rancher-desktop-troubleshooting',
        path:      '/troubleshooting',
        component: Troubleshooting,
      },
    ],
  },
];

export default routes;
