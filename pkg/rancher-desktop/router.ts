
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
        redirect: { name: 'General' },
      },
      {
        name:      'General',
        path:      '/general',
        component: General,
      },
      {
        name:      'Port Forwarding',
        path:      '/port-forwarding',
        component: PortForwarding,
      },
      {
        name:      'Image',
        path:      '/images',
        component: Images,
      },
      {
        name:      'Troubleshooting',
        path:      '/troubleshooting',
        component: Troubleshooting,
      },
    ],
  },
];

export default routes;
