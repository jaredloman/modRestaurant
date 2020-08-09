Ext.onReady(function() {
    MODx.load({xtype: "modrestaurant-page-update"});
});
modRestaurant.page.Update = function(config) {
    config = config || {};
    config.record = config.record || modRestaurant.config.record;
    Ext.applyIf(config, {
        url: config.connectorUrl,
        baseParams: {action: "mgr/" + config.record.class.object + "/update"},
        id: "modrestaurant-page-update-" + config.record.class.object,
        renderTo: "modrestaurant-update-wrapper-div",
        border: false,
        components: [
            {
                cls: "container",
                xtype: "modx-panel",
                items: [
                    {
                        html: "<h2>" + config.record.name + "</h2>",
                        border: false,
                        cls: "modx-page-header",
                        id: "modrestaurant-page-header",
                    },
                    {
                        xtype: "modx-tabs",
                        cls: "modx-tabs",
                        items: [
                            {
                                title: _("modrestaurant.object_update", {object: config.record.class.friendly}),
                                autoHeight: true,
                                autoScroll: true,
                                autoWidth: true,
                                border: false,
                                cls: "main-wrapper",
                                id: "modrestaurant-update-panel-main",
                                items: [
                                    {
                                        id: "modrestaurant-update-panel-fields",
                                        xtype: "modrestaurant-panel-resource",
                                        record: config.record,
                                    }
                                ],
                            }
                        ]
                    },
                    {
                        xtype: "modx-tabs",
                        cls: "modx-tabs",
                        hidden: (config.record.class.name == "mrExtra"),
                        items: [
                            {
                                title: _("modrestaurant.object_attach", {object: config.record.subClass.plural}),
                                autoHeight: true,
                                autoScroll: true,
                                autoWidth: true,
                                border: false,
                                cls: "container",
                                id: "modrestaurant-update-panel-sub",
                                items: this.getSubPanelItems(config),
                            }
                        ],
                    },
                ],
            },
        ],
        buttons: this.getButtons(config),
        listeners: {
            afterrender: this.setup
        },
    });
    modRestaurant.page.Update.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant.page.Update, MODx.Component, {
    setup: function(config) {
        //
    },
    getButtons: function(config) {
        var buttons = [];
        buttons.push('-',
            {
                text: _("modrestaurant.save"),
                id: "modrestaurant-abtn-save",
                cls: "primary-button",
                handler: this.save,
                scope: this,
                keys: [
                    {
                        key: MODx.config.keymap_save || 's',
                        ctrl: true,
                        fn: this.save,
                    }
                ],
            },
            {
                text: _("modrestaurant.duplicate"),
                id: 'modrestaurant-abtn-duplicate',
                handler: this.duplicateRecord,
                scope: this,
            },
            {
                text: _('modrestaurant.delete'),
                id: 'modrestaurant-abtn-delete',
                handler: this.deleteRecord,
                scope: this,
            },
            {
                text: _("modrestaurant.close"),
                id: "modrestaurant-abtn-close",
                handler: this.backHome,
                scope: this,
            },
        );

        return buttons;
    },
    getSubPanelItems: function(config) {
        var itms = [];
        itms.push(
            {
                xtype: "modrestaurant-grid-attach-records",
                record: config.record,
            },
        );
        return itms;
    },
    save: function() {
        var fp = Ext.getCmp("modrestaurant-update-panel-fields");
        if (fp && fp.getForm()) {
            var values = fp.getForm().getValues();
            values.action = "mgr/" + this.config.record.class.object + "/update";
            fp.el.mask(_('saving'));
            MODx.Ajax.request({
                url: modRestaurant.config.connectorUrl,
                params: values,
                listeners: {
                    success: {
                        fn: function(r) {
                            fp.warnUnsavedChanges = false;
                            fp.el.unmask();
                            this.backHome();
                        }, scope: this
                    },
                    failure: {
                        fn: function(r) {
                            fp.el.unmask();
                            MODx.msg.status({
                                title: "Uh oh...",
                                message: "There was an unknown error saving.",
                                delay: 4
                            });
                        }, scope: this
                    },
                    scope: this
                }
            });
        }
    },
    duplicateRecord: function(btn, e) {
        MODx.msg.confirm({
            text: _("modrestaurant.object_duplicate_confirm", {object: this.config.record.class.friendly}),
            url: modRestaurant.config.connectorUrl,
            params: {
                action: "mgr/" + this.config.record.class.object + "/duplicate",
                id: this.config.record.id
            },
            listeners: {
                success: {
                    fn: function(r) {
                        var uri = "namespace=modrestaurant&className=" + this.config.record.class.name + "&id=" + r.object.id;
                        if (modRestaurant.contextAware && modRestaurant.initialContext && modRestaurant.initialContext.key) {
                            uri = uri + "&context=" + modRestaurant.initialContext.key;
                        }
                        MODx.loadPage("update", uri);
                    }, scope: this
                }
            },
        });
    },
    deleteRecord: function(btn, e) {
        MODx.msg.confirm({
            title: _("modrestaurant.object_remove", {object: this.config.record.class.friendly}),
            text: _("modrestaurant.object_remove_confirm", {object: this.config.record.class.friendly}),
            url: modRestaurant.config.connectorUrl,
            params: {
                action: "mgr/" + this.config.record.class.object + "/remove",
                id: this.config.record.id
            },
            listeners: {
                success: {
                    fn: function(r) {
                        this.backHome();
                    }, scope: this
                }
            },
        });
    },
    backHome: function() {
        var uri = "namespace=modrestaurant";
        if (modRestaurant.contextAware && modRestaurant.initialContext && modRestaurant.initialContext.key) {
            uri = uri + "&context=" + modRestaurant.initialContext.key;
        }
        MODx.loadPage("create", uri);
    },
    switchContext: function(field) {
        console.log(field);
    },
    slugify: function(str) {
        return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    },
});
Ext.reg("modrestaurant-page-update", modRestaurant.page.Update);