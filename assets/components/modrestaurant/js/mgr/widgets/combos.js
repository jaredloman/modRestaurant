modRestaurant.combo.ContextList = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        url: modRestaurant.config.connectorUrl,
        baseParams: {
            action: "mgr/context/getlist",
            exclude: "mgr",
            combo: true
        },
        fields: ["key", "name"],
        hiddenName: config.name || "context",
        valueField: "key",
        displayField: "name",
        pageSize: 20
        // Typeahead prevents the dropdown from opening on click, needs a solution first
        // editable: true,
        // typeahead: true,
        // forceSelection: true,
        // queryParam: 'search',
    });
    modRestaurant.combo.ContextList.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant.combo.ContextList, MODx.combo.ComboBox);
Ext.reg("modrestaurant-combo-contexts", modRestaurant.combo.ContextList);

modRestaurant.combo.Object = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        url: modRestaurant.config.connectorUrl,
        baseParams: {
            action: "mgr/mrmenu/getlist",
            combo: true,
            filter: config.filter || false,
            context: modRestaurant.context,
        },
        fields: ["id", "name"],
        hiddenName: config.name || "menu",
        valueField: "id",
        displayField: "name",
        pageSize: 20,
        editable: true,
        typeahead: true,
        forceSelection: true,
        queryParam: 'query',
        tpl: '<tpl for="."><div class="x-combo-list-item">{name} ({id})</div></tpl>',
    });
    modRestaurant.combo.Object.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant.combo.Object, MODx.combo.ComboBox);
Ext.reg("modrestaurant-combo-objects", modRestaurant.combo.Object);