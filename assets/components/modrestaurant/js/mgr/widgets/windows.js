modRestaurant.window.Context = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        id: "modrestaurant-window-context",
        title: _("modrestaurant.choose_context"),
        fields: [
            {
                xtype: "modrestaurant-combo-contexts",
                fieldLabel: _("modrestaurant.choose_context_loading"),
                name: "context",
                id: "modrestaurant-window-context-combo",
                anchor: "100%",
                required: true,
            },
        ],
    });
    modRestaurant.window.Context.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant.window.Context, MODx.Window, {
    submit: function(close) {
        close = close === false ? false : true;
        var f = this.fp.getForm();
        if (f.isValid() && this.fireEvent('beforeSubmit', f.getValues())) {
            var vals = f.getValues();
            var fv = this.fp.findByType("modrestaurant-combo-contexts")[0].getRawValue();
            this.fireEvent('success', {context: vals.context, raw: fv});
            if (close) {
                this.config.closeAction !== 'close' ? this.hide() : this.close();
            }
            this.doLayout();
        }
    }
});
Ext.reg("modrestaurant-window-context", modRestaurant.window.Context);

modRestaurant.window.AttachRecord = function(config) {
    config = config || {};
    config.record = config.record || modRestaurant.config.record;
    Ext.applyIf(config, {
        id: "modrestaurant-window-record-attach",
        url: modRestaurant.config.connectorUrl,
        baseParams: {
            action: "mgr/" + config.record.pivot.object + "/create",
            parent: config.record.id,
        },
        autoHeight: true,
        title: _("modrestaurant.attach_items"),
        fields: [
            {
                xtype: "modrestaurant-combo-objects",
                fieldLabel: _("modrestaurant.mrcategory_choose"),
                name: "category",
                id: "modrestaurant-window-object-combo",
                baseParams: {
                    action: "mgr/mrcategory/getlist",
                    combo: true,
                    filter: true,
                    parent: config.record.id || "",
                },
                filter: true,
                parent: config.parent,
                anchor: "100%",
                required: true,
            },
            {
                xtype: "hidden",
                name: "menu",
                value: config.parent,
            },
        ],
    });
    modRestaurant.window.AttachRecord.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant.window.AttachRecord, MODx.Window);
Ext.reg("modrestaurant-window-record-attach", modRestaurant.window.AttachRecord);

modRestaurant.window.UpdateRecord = function(config) {
    config = config || {};
    config.mode = "create";
    config.record = config.record || modRestaurant.config.record;
    Ext.applyIf(config, {
        title: _("modrestaurant.object_window_title", {object: config.record.class.friendly, mode: this.ucFirst(config.mode)}),
        url: modRestaurant.config.connectorUrl,
        width: 600,
        autoHeight: true,
        baseParams: {
            action: "mgr/" + config.record.class.object + "/" + config.mode,
            context: modRestaurant.context,
        },
        fields: this.getFields(config),
    });
    modRestaurant.window.UpdateRecord.superclass.constructor.call(this, config);
    this.on("activate", function(w, e) {
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
                            init(MODx.loadRTE(item.id));
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
    this.on("deactivate", function(w, e) {
        try {
            if (MODx.config.use_editor && MODx.loadRTE) {
                var els = this.findByType("textarea");
                Ext.each(els, function(item, index, allItems) {
                    if (item.id) {
                        if (MODx.loadRedactorConfigurationSet && window.$R) {
                            window.$R('#' + item.id, 'destroy');
                        }
                    }
                }, this);
            }
        } catch (e) {
            if (console) {
                console.error(_("modrestaurant.rte_err_cd"));
            }
        }
    }, this);
    this.on("hide", function(w, e) {
        form = this.fp.getForm();
        form.reset();
    }, this);
};
Ext.extend(modRestaurant.window.UpdateRecord, MODx.Window, {
    getFields: function(config) {
        config = config || {};
        config.mode = config.mode || "create";
        config.record = config.record || modRestaurant.config.record;
        var flds = [];
        if (config.mode == "update") {
            flds.push(
                {
                    xtype: "hidden",
                    name: "id",
                },
            );
        }
        flds.push(
            {
                xtype: "textfield",
                fieldLabel: _("modrestaurant.name"),
                name: "name",
                anchor: "100%",
            },
            {
                xtype: "textarea",
                fieldLabel: _("modrestaurant.description"),
                name: "description",
                anchor: "100%",
            },
        );
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
        if (config.record.class.name == "mrMenu" || config.record.class.name == "mrCategory") {
            flds.push(
                {
                    xtype: "textarea",
                    fieldLabel: _("modrestaurant.footer"),
                    name: "footer",
                    anchor: "100%",
                }
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
    ucFirst: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
});
Ext.reg("modrestaurant-window-record-update", modRestaurant.window.UpdateRecord);