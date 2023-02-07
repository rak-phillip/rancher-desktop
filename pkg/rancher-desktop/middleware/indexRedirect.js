/**
 * This middleware redirects / to /general
 */
export default ({ route, next, redirect }) => {
  switch (route.path) {
  case process.env.RD_ENV_PLUGINS_DEV:
    next();
    break;
  case '/':
    redirect(301, '/rancher-desktop/general');
    break;
  default:
    next();
  }
};
