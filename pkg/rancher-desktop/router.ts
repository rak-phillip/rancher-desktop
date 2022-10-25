import Clock from '@pkg/NewFeature.vue';
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [{
  name:      'rancher-desktop-general',
  path:      '/general',
  component: Clock,
}];

export default routes;
