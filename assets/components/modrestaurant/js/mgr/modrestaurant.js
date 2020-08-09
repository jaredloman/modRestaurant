var modRestaurant = function(config) {
    config = config || {};
    modRestaurant.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant, Ext.Component, {
    page: {},
    window: {},
    grid: {},
    tree: {},
    panel: {},
    tabs: {},
    combo: {},
    config: {},
});
Ext.reg("modrestaurant", modRestaurant);
modRestaurant = new modRestaurant();