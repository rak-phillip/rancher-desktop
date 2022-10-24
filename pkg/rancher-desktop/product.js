export const NAME = 'rancher-desktop';

export function init(plugin, store) {
  const {
    product,
    _basicType,
    _configureType,
    _virtualType,
    _headers,
    _hideBulkActions,
  } = plugin.DSL(store, NAME);

  product({
    inStore:             'management',
    icon:                'globe',
    label:               'rancher-desktop',
    removable:           false,
    showClusterSwitcher: false,
    category:            'global',
    to:                  { name: 'rancher-desktop', params: { cluster: 'local' } },
  });
}
