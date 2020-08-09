modRestaurant.grid.GridPanel = function(config) {
    config = config || {};
    config.record = config.record || modRestaurant.config.record;
    Ext.applyIf(config, {
        id: "modrestaurant-grid-" + config.record.class.object,
        url: modRestaurant.config.connectorUrl,
        isSubClass: false,
        baseParams: {
            action: "mgr/mrmenu/getList",
            context: modRestaurant.context,
        },
        fields: this.getFields(config),
        paging: true,
        remoteSort: true,
        autoExpandColumn: "name",
        save_action: "mgr/mrmenu/updateFromGrid",
        autosave: true,
        enableDragDrop: true,
        ddGroup: config.record.class.object,
        ddText: "Place this row.",
        columns: this.getCols(config),
        tbar: this.getTbar(config),
    });
    modRestaurant.grid.GridPanel.superclass.constructor.call(this, config);
    this.on("render", function(w, e) {
        this.prepareDDSort(this);
    }, this);
};
Ext.extend(modRestaurant.grid.GridPanel, MODx.grid.Grid, {
    search: function(tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },
    getMenu: function(config) {
        return [
            {
                text: _("modrestaurant.object_update", {object: config.record.class.friendly}),
                handler: this.updateRecord
            },
            {
                text: _("modrestaurant.quickupdate"),
                handler: this.quickUpdate
            }, '-',
            {
                text: _("modrestaurant.object_duplicate", {object: config.record.class.friendly}),
                handler: this.duplicateRecord
            }, '-', {
                text: _("modrestaurant.object_remove", {object: config.record.class.friendly}),
                handler: this.removeRecord
            }
        ];
    },
    updateRecord: function(btn, e) {
        var className = this.config.isSubClass ? this.config.record.subClass.name : this.config.record.class.name;
        var id = this.config.isSubClass ? this.menu.record.json[this.config.record.class.child] : this.menu.record.id;
        var uri = "namespace=modrestaurant&className=" + className + "&id=" + id;
        if (modRestaurant.contextAware && modRestaurant.context) {
            uri = uri + "&context=" + modRestaurant.context;
        }
        MODx.loadPage("update", uri);
    },
    quickUpdate: function(btn, e) {
        e.preventDefault();
        this.menu.record.class = this.config.record.class;
        if (!this.updateWindow) {
            this.updateWindow = MODx.load({
                xtype: "modrestaurant-window-record-update",
                record: this.menu.record,
                mode: "update",
                listeners: {
                    "success": {fn: this.refresh, scope: this}
                }
            });
        }
        this.updateWindow.fp.getForm().reset();
        this.updateWindow.setValues(this.menu.record);
        this.updateWindow.show(e.target);
    },
    duplicateRecord: function(btn, e) {
        MODx.msg.confirm({
            title: _("modrestaurant.object_duplicate", {object: this.config.record.class.friendly}),
            text: _("modrestaurant.object_duplicate_confirm", {object: this.config.record.class.friendly}),
            url: this.config.url,
            params: {
                action: "mgr/" + this.config.record.class.object + "/duplicate",
                id: this.menu.record.id
            },
            listeners: {
                "success": {fn: this.refresh, scope: this}
            }
        });
    },
    removeRecord: function() {
        var friendly = this.config.isSubClass ? this.config.record.subClass.friendly : this.config.record.class.friendly;
        var obj = this.config.isSubClass ? this.config.record.pivot.object : this.config.record.class.object;
        var text = this.config.isSubClass ? _("modrestaurant.object_remove_pivot_confirm", {object: friendly}) : _("modrestaurant.object_remove_confirm", {object: friendly})
        MODx.msg.confirm({
            title: _("modrestaurant.object_remove", {object: friendly}),
            text: text,
            url: this.config.url,
            params: {
                action: "mgr/" + obj + "/remove",
                id: this.menu.record.id
            },
            listeners: {
                "success": {fn: this.refresh, scope: this}
            }
        });
    },
    getTbar: function(config) {
        return [
            {
                xtype: "textfield",
                emptyText: _("modrestaurant.object_search", {object: config.record.class.plural}),
                listeners: {
                    "change": {fn: this.search, scope: this},
                    "render": {
                        fn: function(cmp) {
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER,
                                fn: function() {
                                    this.fireEvent("change", this);
                                    this.blur();
                                    return true;
                                },
                                scope: cmp
                            });
                        }, scope: this
                    }
                }
            }, '->', {
                text: _("modrestaurant.object_create", {object: config.record.class.friendly}),
                handler: function(btn, e) {
                    if (!this.createWindow) {
                        this.createWindow = MODx.load({
                            xtype: "modrestaurant-window-record-update",
                            record: config.record,
                            mode: "create",
                            blankValues: true,
                            listeners: {
                                "success": {fn: this.refresh, scope: this}
                            }
                        });
                    }
                    this.createWindow.show(e.target);
                }, scope: this,
            }
        ];
    },
    getFields: function(config) {
        var flds = ["id", "name", "description"];
        flds.push("active", "context", "sort");
        if (config.record.class.name == "mrItem" || config.record.class.name == "mrExtra") {
            flds.push("price");
        }
        if (config.record.class.name == "mrItem") {
            flds.push("photo", "featured");
        }
        if (config.record.class.name == "mrMenu" || config.record.class.name == "mrCategory") {
            flds.push("footer");
        }
        return flds;
    },
    getCols: function(config) {
        var friendly = config.isSubClass ? config.record.subClass.friendly : config.record.class.friendly;
        var cols = [];
        cols.push(
            {
                header: _("id"),
                dataIndex: "id",
                sortable: true,
                width: 20,
            },
        );
        if (config.record.class.name == "mrItem") {
            cols.push(
                {
                    header: _("modrestaurant.photo"),
                    dataIndex: "photo",
                    width: 60,
                    renderer: this._renderImage,
                },
            );
        }
        cols.push(
            {
                header: _("modrestaurant.name"),
                dataIndex: "name",
                sortable: true,
                width: 100,
                editor: {xtype: "textfield"},
            },
            {
                header: _("modrestaurant.description"),
                dataIndex: "description",
                sortable: false,
                width: 300,
            },
        );
        if (config.record.class.name == "mrItem" || config.record.class.name == "mrExtra") {
            cols.push(
                {
                    header: _("modrestaurant.price"),
                    dataIndex: "price",
                    sortable: false,
                    width: 60,
                    renderer: {fn: this._renderTotal, scope: this},
                },
            );
        }
        cols.push(
            {
                header: _("modrestaurant.active"),
                xtype: "modactioncolumn",
                width: 40,
                items: [
                    {
                        fas: true,
                        tooltip: _("modrestaurant.active"),
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.store.getAt(rowIndex);
                            var active = rec.get("active");
                            if (active == "on") {
                                rec.set("active", "off");
                            } else {
                                rec.set("active", "on");
                            }
                            grid.getView().refresh();
                            var e = {record: rec};
                            grid.saveRecord(e);
                        },
                        getClass: function(v, meta, rec) {  // Or return a class from a function
                            if (rec.get("active") == "on") {
                                this.items[0].tooltip = _("modrestaurant.deactivate");
                                return "far fa-check-square";
                            } else {
                                this.items[0].tooltip = _("modrestaurant.activate");
                                return "far fa-square";
                            }
                        },
                    },
                ],
            },
            {
                header: _("modrestaurant.actions"),
                xtype: "modactioncolumn",
                width: 80,
                items: this.getActionColItems(config),
            },
        );
        return cols;
    },
    getActionColItems: function(config) {
        var friendly = config.isSubClass ? config.record.subClass.friendly : config.record.class.friendly;
        var itms = [];
        itms.push(
            {
                fas: true,
                iconCls: "fas fa-pen-square",
                tooltip: _("modrestaurant.object_update", {object: friendly}),
                handler: function(grid, rowIndex, colIndex) {
                    grid.menu.record = grid.store.getAt(rowIndex);
                    grid.menu.removeAll();
                    grid.updateRecord();
                }
            },
        );
        if (!config.isSubClass) {
            itms.push(
                {
                    fas: true,
                    iconCls: "fas fa-clone",
                    tooltip: _("modrestaurant.object_duplicate", {object: friendly}),
                    handler: function(grid, rowIndex, colIndex) {
                        grid.menu.record = grid.store.getAt(rowIndex);
                        grid.menu.removeAll();
                        grid.duplicateRecord();
                    },
                },
            );
        }
        itms.push(
            {
                fas: true,
                iconCls: "fas fa-trash",
                tooltip: _("modrestaurant.object_remove", {object: friendly}),
                handler: function(grid, rowIndex, colIndex) {
                    grid.menu.record = grid.store.getAt(rowIndex);
                    grid.menu.removeAll();
                    grid.removeRecord();
                },
            },
        );
        return itms;
    },
    prepareDDSort: function(grid) {
        this.dropTarget = new Ext.dd.DropTarget(grid.getView().mainBody, {
            ddGroup: this.config.record.class.object,
            copy: false,
            notifyDrop: function(dragSource, e, data) {
                var ds = grid.store;
                var sm = grid.getSelectionModel();
                var rows = sm.getSelections();
                if (dragSource.getDragData(e)) {
                    var targetNode = dragSource.getDragData(e).selections[0];
                    var sourceNode = data.selections[0];
                    if (targetNode.id != sourceNode.id) {
                        grid.sortRows(sourceNode, targetNode);
                    }
                }
            }
        });
    },
    sortRows: function(sourceNode, targetNode) {
        var store = this.getStore();
        var sourceIdx = store.indexOf(sourceNode);
        var targetIdx = store.indexOf(targetNode);

        store.removeAt(sourceIdx);
        store.insert(targetIdx, sourceNode);

        Ext.each(store.data.items, function(item, index, allItems) {
            if (sourceNode.get('context') === item.get('context')) {
                var record = store.getById(item.id);
                record.set('sort', index);
                var e = {record: record};
                this.saveRecord(e);
            }
        }, this);

        this.getView().refresh();
    },
    _renderTotal: function(val, md, rec, row, col, s) {
        var output = '';
        if (val > 0) {
            output = _("modrestaurant.currency_symbol") + parseFloat(val).toFixed(2);
        }
        return output;
    },
    _renderImage: function(val, md, rec, row, col, s) {
        var source = MODx.config.base_url + modRestaurant.config.mediasourcePath;
        var defaultImage = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
            '\t viewBox="0 0 60 20" style="enable-background:new 0 0 60 20;" xml:space="preserve">\n' +
            '<style type="text/css">\n' +
            '\t.st0{fill:#D0D1CF;}\n' +
            '</style>\n' +
            '<path class="st0" d="M22.02,12.72L22.02,12.72v0.05l0,0V12.72z M23.55,5.03c0-1.57-0.9-2.86-1.99-2.86s-1.99,1.28-1.99,2.86\n' +
            '\tc0,1.34,0.64,2.45,1.52,2.77c0.07,0.96,0.2,2.4,0.18,3.86c-0.02,2.04-0.28,4.08-0.28,4.72c0,0.02,0,0.05,0,0.06\n' +
            '\tc0,0.51,0.26,0.92,0.58,0.92s0.58-0.41,0.58-0.92c0-0.01,0-0.04,0-0.05c0.01-0.62-0.27-2.67-0.28-4.75\n' +
            '\tc-0.01-1.46,0.11-2.91,0.18-3.86C22.89,7.48,23.55,6.37,23.55,5.03z M37.56,2.23l-0.28,3.84h0.28h0.28L37.56,2.23z M40.07,2.23\n' +
            '\tL39.8,6.07h0.28h0.28L40.07,2.23z M38.81,2.23l-0.28,3.84h0.28h0.28L38.81,2.23z M40.35,6.07h-0.56c0,0-0.06,0.85-0.34,0.85\n' +
            '\tc-0.28,0-0.37-0.85-0.37-0.85h-0.56c0,0-0.02,0.76-0.34,0.76c-0.32,0-0.36-0.76-0.36-0.76h-0.56c0,0,0,1.82,1.08,2.22\n' +
            '\tc0.06,0.83,0.2,2.32,0.18,3.79c-0.01,1.86-0.27,3.7-0.26,4.29c0,0.02,0,0.05,0,0.06c0,0.47,0.23,0.85,0.52,0.85\n' +
            '\tc0.28,0,0.52-0.38,0.52-0.85c0-0.01,0-0.02,0-0.05c0.01-0.56-0.24-2.43-0.26-4.32c-0.01-1.48,0.12-2.97,0.18-3.79\n' +
            '\tC40.35,7.9,40.35,6.07,40.35,6.07z M30.19,3.9c-3.24,0-5.86,2.62-5.86,5.86s2.62,5.86,5.86,5.86s5.86-2.62,5.86-5.86\n' +
            '\tC36.05,6.53,33.42,3.9,30.19,3.9z"/>\n' +
            '</svg>';
        if (val.substr(0, 4) == 'http') {
            return '<img style="height:60px;" src="' + val + '"/>';
        }

        if (val != '') {
            return '<img src="' + MODx.config.connectors_url + 'system/phpthumb.php?h=60&src=' + source + val + '&HTTP_MODAUTH=' + MODx.siteId + '&wctx=mgr&source=' + modRestaurant.config.mediasourceId + '" alt="" />';
        } else {
            return defaultImage;
        }
        return val;
    },
});
Ext.reg("modrestaurant-grid-gridpanel", modRestaurant.grid.GridPanel);

modRestaurant.grid.AttachRecords = function(config) {
    config = config || {};
    config.record = config.record || modRestaurant.config.record;
    Ext.applyIf(config, {
        id: "modrestaurant-grid-" + config.record.class.object,
        url: modRestaurant.config.connectorUrl,
        autoWidth: true,
        isSubClass: true,
        cls: "main-wrapper",
        baseParams: {
            action: "mgr/" + config.record.pivot.object + "/getList",
            parent: config.record.id || "",
        },
        save_action: "mgr/" + config.record.pivot.object + "/updateFromGrid",
    });
    modRestaurant.grid.AttachRecords.superclass.constructor.call(this, config);
};
Ext.extend(modRestaurant.grid.AttachRecords, modRestaurant.grid.GridPanel, {
    getMenu: function(config) {
        return [
            {
                text: _("modrestaurant.object_remove", {object: config.record.subClass.friendly}),
                handler: this.removeRecord
            }
        ];
    },
    getFields: function(config) {
        var flds = ["id", "name", "description"];
        if (config.record.pivot.name == "mrMenuCategory") {
            flds.push("menu", "category");
        }
        if (config.record.pivot.name == "mrCategoryItem") {
            flds.push("category", "item");
        }
        if (config.record.pivot.name == "mrItemExtra") {
            flds.push("item", "extra");
        }
        if (config.record.pivot.name == "mrCategoryItem" || config.record.pivot.name == "mrItemExtra") {
            flds.push("price");
        }
        flds.push("sort");
        return flds;
    },
    getCols: function(config) {
        var cols = [];
        if (config.record.pivot.name == "mrMenuCategory") {
            cols.push(
                {
                    header: _("modrestaurant.mrcategory"),
                    dataIndex: "name",
                    width: 100,
                },
            );
        }
        if (config.record.pivot.name == "mrCategoryItem") {
            cols.push(
                {
                    header: _("modrestaurant.mritem"),
                    dataIndex: "name",
                    width: 100,
                },
            );
        }
        if (config.record.pivot.name == "mrItemExtra") {
            cols.push(
                {
                    header: _("modrestaurant.mrextra"),
                    dataIndex: "name",
                    width: 100,
                },
            );
        }
        cols.push(
            {
                header: _("modrestaurant.description"),
                dataIndex: "description",
                width: 300,
            },
        );
        if (config.record.pivot.name == "mrCategoryItem" || config.record.pivot.name == "mrItemExtra") {
            cols.push(
                {
                    header: _("modrestaurant.price_override"),
                    dataIndex: "price",
                    width: 100,
                    renderer: {fn: this._renderTotal, scope: this},
                }
            );
        }
        cols.push(
            {
                header: _("modrestaurant.actions"),
                xtype: "modactioncolumn",
                width: 80,
                items: this.getActionColItems(config),
            },
        );
        return cols;
    },
    getTbar: function(config) {
        var tbar = [];
        tbar.push(
            {
                xtype: "textfield",
                emptyText: _("modrestaurant.object_search", {object: config.record.subClass.plural}),
                listeners: {
                    "change": {fn: this.search, scope: this},
                    "render": {
                        fn: function(cmp) {
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER,
                                fn: function() {
                                    this.fireEvent("change", this);
                                    this.blur();
                                    return true;
                                },
                                scope: cmp
                            });
                        }, scope: this
                    },
                }
            },
            '->',
            {
                text: _("modrestaurant.object_attach", {object: config.record.subClass.plural}),
                handler: function(btn, e) {
                    if (!this.attachWindow) {
                        this.attachWindow = MODx.load({
                            xtype: "modrestaurant-window-record-attach",
                            title: _("modrestaurant.object_attach", {object: config.record.subClass.plural}),
                            record: config.record,
                            fields: this.getWindowFields(config),
                            blankValues: true,
                            listeners: {
                                "success": {
                                    fn: function(frm) {
                                        this.refresh();
                                        var cmb = Ext.getCmp("modrestaurant-window-object-combo");
                                        cmb.getStore().load();
                                    }, scope: this,
                                }
                            },
                        });
                    }
                    this.attachWindow.fp.getForm().setValues({price: ""});
                    this.attachWindow.show(e.target);
                }, scope: this,
            },
        );
        return tbar;
    },
    getWindowFields: function(config) {
        var flds = [];
        flds.push(
            {
                xtype: "modrestaurant-combo-objects",
                fieldLabel: _("modrestaurant.object_choose", {object: config.record.subClass.friendly}),
                baseParams: {
                    action: "mgr/" + config.record.subClass.object + "/getlist",
                    combo: true,
                    filter: true,
                    parent: config.record.id || "",
                },
                name: config.record.class.child,
                id: "modrestaurant-window-object-combo",
                anchor: "100%",
                required: true,
                parent: config.record.id,
                filter: true,
            },
        );

        if (config.record.class.name !== 'mrMenu') {
            flds.push(
                {
                    xtype: "numericfield",
                    fieldLabel: _("modrestaurant.price_override"),
                    name: "price",
                    anchor: "100%",
                },
            );
        }

        flds.push(
            {
                xtype: "hidden",
                name: config.record.class.parent,
                value: config.record.id,
            },
        );
        return flds;
    },
    sortRows: function(sourceNode, targetNode) {
        var store = this.getStore();
        var sourceIdx = store.indexOf(sourceNode);
        var targetIdx = store.indexOf(targetNode);

        store.removeAt(sourceIdx);
        store.insert(targetIdx, sourceNode);

        Ext.each(store.data.items, function(item, index, allItems) {
            var record = store.getById(item.id);
            record.set('sort', index);
            var e = {record: record};
            this.saveRecord(e);
        }, this);

        this.getView().refresh();
    },
});
Ext.reg("modrestaurant-grid-attach-records", modRestaurant.grid.AttachRecords);