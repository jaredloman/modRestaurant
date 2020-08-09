modRestaurant.panel.Resource = function(config) {
    config = config || {};
    config.record = config.record || modRestaurant.config.record;
    Ext.applyIf(config, {
        url: modRestaurant.config.connectorUrl,
        id: "modrestaurant-panel-resource",
        bodyStyle: "",
        cls: "form-with-labels",
        layout: "form",
        defaults: {collapsible: false, autoHeight: true},
        forceLayout: true,
        items: this.getFields(config),
        fileUpload: true,
        listeners: {
            //'setup': {fn: this.setup, scope: this},
            // 'success': {fn: this.success, scope: this},
            // 'failure': {fn: this.failure, scope: this},
            'beforeSubmit': {fn: this.beforeSubmit, scope: this},
            'fieldChange': {fn: this.onFieldChange, scope: this},
            'failureSubmit': {fn: this.failureSubmit, scope: this},
        },
    });
    modRestaurant.panel.Resource.superclass.constructor.call(this, config);
    this.on("afterrender", function(w, e) {
        this.setup();
        if (MODx.config.use_editor && MODx.loadRTE) {
            var init = MODx.loadRedactorConfigurationSet || MODx.loadRTE;
            var redactorSet = modRestaurant.config.redactorConfig || false;
            var els = this.findByType("textarea");
            setTimeout(function() {
                Ext.each(els, function(item, index, allItems) {
                    if (item.id) {
                        if (redactorSet) {
                            init(item.id, redactorSet);
                        } else {
                            MODx.loadRTE(item.id);
                        }

                        var el = Ext.get(item.id);
                        if (el) {
                            el.on("keydown", this.fieldChangeEvent, this);
                        }
                    }
                }, this);
            }, 150);
        }
    }, this);
    this.on("beforedestroy", function(w, e) {
        if (MODx.config.use_editor && MODx.loadRTE) {
            var els = this.findByType("textarea");
            Ext.each(els, function(item, index, allItems) {
                if (item.id) {
                    if (MODx.loadRedactorConfigurationSet && window.$R) {
                        window.$R("#" + item.id, 'destroy');
                    }
                }
            }, this);
        }
    }, this);
};
Ext.extend(modRestaurant.panel.Resource, MODx.FormPanel, {
    initialized: false,
    warnUnsavedChanges: false,
    setup: function() {
        if (!this.initialized) {
            this.getForm().setValues(this.config.record);
            this.defaultValues = this.config.record || {};
            var panel = this;
            window.onbeforeunload = function() {
                if (panel.warnUnsavedChanges) {
                    return _('unsaved_changes');
                }
            };
        }
        if (!Ext.isEmpty(this.config.record.name)) {
            var name = Ext.util.Format.stripTags(this.config.record.name);
            name = Ext.util.Format.htmlEncode(name);
            Ext.getCmp("modrestaurant-page-header").getEl().update('<h2>' + name + '</h2>');
        }
        this.fireEvent('ready');
        this.initialized = true;
        MODx.fireEvent('ready');
        MODx.sleep(4);
        this.fireEvent('load');
    },
    onFieldChange: function(o) {
        console.log(o);
        if (this.isReady || MODx.request.reload) {
            this.warnUnsavedChanges = true;
        }
    },
    beforeSubmit: function(o) {
        this.warnUnsavedChanges = false;
        var btn = Ext.getCmp("modrestaurant-abtn-save");
        if (btn) {
            btn.disable();
        }
        return this.fireEvent("save", {
            values: this.getForm().getValues(),
        });
    },
    failure: function(o) {
        this.warnUnsavedChanges = true;
        var btn = Ext.getCmp("modrestaurant-abtn-save");
        if (btn) {
            btn.enable();
        }
        this.fireEvent("failureSubmit");
    },
    getFields: function(config) {
        config = config || {};
        config.record = config.record || modRestaurant.config.record;
        var flds = [];
        flds.push({
            layout: "column",
            border: false,
            anchor: "100%",
            id: "modrestaurant-resource-main-columns",
            defaults: {
                labelSeparator: "",
                labelAlign: "top",
                border: false,
                msgTarget: "under"
            },
            items: [
                {
                    xtype: "hidden",
                    fieldLabel: _("id"),
                    hideLabel: true,
                    name: "id",
                    anchor: "100%",
                    value: config.record.id,
                    submitValue: true,
                },
                {
                    xtype: "hidden",
                    name: "context",
                    value: config.record.context || modRestaurant.context,
                    submitValue: true,
                },
                {
                    columnWidth: .67,
                    layout: "form",
                    id: "modrestaurant-resource-main-left",
                    defaults: {msgTarget: "under"},
                    items: this.getMainLeftFields(config)
                }, {
                    columnWidth: .33,
                    layout: "form",
                    labelWidth: 0,
                    border: false,
                    id: "modx-resource-main-right",
                    style: "margin-right: 0",
                    defaults: {msgTarget: "under"},
                    items: this.getMainRightFields(config)
                }
            ]
        });
        return flds;
    },
    getMainLeftFields: function(config) {
        config = config || {};
        config.record = config.record || modRestaurant.config.record;
        var flds = [];
        flds.push(
            {
                xtype: "textfield",
                fieldLabel: _("modrestaurant.name"),
                name: "name",
                id: "modrestaurant-menu-update-name",
                anchor: "100%",
                allowBlank: false,
                enableKeyEvents: true,
                listeners: {
                    "keyup": {
                        fn: function(f) {
                            var title = Ext.util.Format.stripTags(f.getValue());

                            title = Ext.util.Format.htmlEncode(title);
                            Ext.getCmp("modrestaurant-page-header").getEl().update('<h2>' + title + '</h2>');
                        }, scope: this
                    },
                    "blur": {
                        fn: function(f, e) {
                            var title = Ext.util.Format.stripTags(f.getValue());
                        }, scope: this
                    }
                }
            },
            {
                xtype: "textarea",
                fieldLabel: _("modrestaurant.description"),
                name: "description",
                id: "modrestaurant-menu-update-description",
                anchor: "100%",
                listeners: {
                    change: function(field, newVal, oldVal) {
                        console.log(newVal);
                    }
                }
            },
        );
        if (config.record.class.name == "mrMenu" || config.record.class.name == "mrCategory") {
            flds.push(
                {
                    xtype: "textarea",
                    fieldLabel: _("modrestaurant.footer"),
                    name: "footer",
                    id: "modrestaurant-menu-update-footer",
                    anchor: "100%",
                    listeners: {
                        change: function(field, newVal, oldVal) {
                            console.log(newVal);
                        }
                    }
                }
            );
        }

        return flds;
    },
    getMainRightFields: function(config) {
        config = config || {};
        config.record = config.record || modRestaurant.config.record;
        var flds = [];
        if (config.record.class.name == "mrItem" || config.record.class.name == "mrExtra") {
            flds.push(
                {
                    xtype: "numericfield",
                    fieldLabel: _("modrestaurant.price"),
                    name: "price",
                    anchor: "100%"
                },
            );
        }
        if (config.record.class.name == "mrItem") {
            flds.push(
                {
                    xtype: "modx-combo-browser",
                    fieldLabel: _("modrestaurant.photo"),
                    name: "photo",
                    anchor: "100%",
                    source: modRestaurant.config.mediasourceId
                },
                {
                    xtype: "checkbox",
                    fieldLabel: _("modrestaurant.featured"),
                    name: "featured",
                    description: _("modrestaurant.featured_desc")
                },
            );
        }
        flds.push(
            {
                xtype: "checkbox",
                fieldLabel: _("modrestaurant.active"),
                description: _("modrestaurant.active_desc"),
                name: "active",
                anchor: "100%",
            },
        );
        return flds;
    },
});
Ext.reg("modrestaurant-panel-resource", modRestaurant.panel.Resource);

var triggerDirtyField = function(fld) {
    Ext.getCmp("modrestaurant-panel-resource").fieldChangeEvent(fld);
};
MODx.triggerRTEOnChange = function() {
    triggerDirtyField(Ext.getCmp("modrestaurant-menu-update-description"));
    triggerDirtyField(Ext.getCmp("modrestaurant-menu-update-footer"));
};
MODx.fireResourceFormChange = function(f, nv, ov) {
    Ext.getCmp("modrestaurant-panel-resource").fireEvent("fieldChange");
};