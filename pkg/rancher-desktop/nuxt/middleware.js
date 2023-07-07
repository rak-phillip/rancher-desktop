const middleware = {}

middleware['i18n'] = require('../../pkg/rancher-desktop/middleware/i18n.js')
middleware['i18n'] = middleware['i18n'].default || middleware['i18n']

middleware['indexRedirect'] = require('../../pkg/rancher-desktop/middleware/indexRedirect.js')
middleware['indexRedirect'] = middleware['indexRedirect'].default || middleware['indexRedirect']

export default middleware
