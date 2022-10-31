export const NAME = 'rancher-desktop';

export function init(plugin, store) {
  const {
    product,
    // basicType,
    // configureType,
    // virtualType,
    // headers,
    // hideBulkActions,
  } = plugin.DSL(store, NAME);

  product({
    inStore:             'management',
    icon:                'globe',
    label:               'Rancher Desktop',
    removable:           false,
    showClusterSwitcher: false,
    category:            'global',
    to:                  { name: 'rancher-desktop-general' },
  });
}
