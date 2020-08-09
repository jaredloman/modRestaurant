Ext.onReady(function() {
    MODx.load({xtype: "modrestaurant-page-create"});
});
modRestaurant.page.Create = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        id: "modrestaurant-page-create",
        renderTo: "modrestaurant-create-wrapper-div",
        border: false,
        context: "",
        components: [
            {
                cls: "container",
                xtype: "modx-panel",
                items: [
                    {
                        html: "<h2>" + _("modrestaurant.management") + "</h2>",
                        border: false,
                        cls: "modx-page-header",
                        id: "modrestaurant-header",
                    },
                    {
                        xtype: "modx-panel",
                        id: "modrestaurant-tabpanel-create",
                        cls: "modx-tabs x-tab-panel-bwrap",
                        border: false,
                        anchor: "100%",
                        items: [
                            {
                                html: "<p>" + _('modrestaurant.desc') + "</p>",
                                xtype: "modx-description",
                            },
                            {
                                xtype: "modx-vtabs",
                                title: _("modrestaurant.desc"),
                                border: false,
                                labelAlign: "top",
                                hideMode: "offsets",
                                deferredRender: false,
                                forceLayout: true,
                                items: this.getTabs(config),
                                stateful: true,
                                id: "modrestaurant-page-create-tabs",
                                stateId: "modrestaurant-page-create",
                                stateEvents: ["tabchange"],
                                getState: function() {
                                    return {
                                        activeTab: this.items.indexOf(this.getActiveTab())
                                    };
                                },
                                // only to redo the grid layout after the content is rendered
                                // to fix overflow components' panels, especially when scroll bar is shown up
                                listeners: {
                                    afterrender: function(tabPanel) {
                                        if (modRestaurant.contextAware && !modRestaurant.initialContext) {
                                            this.getEl().mask(_("modrestaurant.choose_context_loading"));
                                        }
                                        tabPanel.doLayout();
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
        buttons: this.getButtons(),
        listeners: {
            afterrender: this.setup
        },
    });
    modRestaurant.page.Create.superclass.constructor.call(this, config);
    if (modRestaurant.contextAware && modRestaurant.initialContext && modRestaurant.initialContext.key) {
        var heading = Ext.getCmp("modrestaurant-header");
        heading.update('<h2>' + _("modrestaurant.management") + ' - ' + modRestaurant.initialContext.name + '</h2>');
    }
};
Ext.extend(modRestaurant.page.Create, MODx.Component, {
    setup: function() {
        // setTimeout(function() {
        //
        // }, 150);
        var hash = window.location.hash.substr(1);
        if (hash.length > 0) {
            var id = "modrestaurant-create-tab-" + hash,
                tabPanel = Ext.getCmp("modrestaurant-page-create-tabs");
            if (tabPanel && tabPanel.items.keys.indexOf(id) !== -1) {
                tabPanel.setActiveTab(id);
            }
        }
        if (modRestaurant.contextAware && !modRestaurant.initialContext) {
            this.getEl().mask();
            this.selectContext();
        }
    },
    selectContext: function() {
        if (!this.contextWindow) {
            this.contextWindow = MODx.load({
                xtype: "modrestaurant-window-context",
                listeners: {
                    "success": {fn: this.switchContext, scope: this}
                }
            });
        }
        if (modRestaurant.context) {
            this.contextWindow.setValues({
                context: this.context,
            });
        }
        this.contextWindow.show();
    },
    getButtons: function() {
        var buttons = [];

        if (modRestaurant.contextAware) {
            buttons.push('-',
                // {
                //     xtype: 'panel',
                //     html: '<span style="padding-left: 1em; padding-right: 1em;">' + _('modrestaurant.choose_context') + ': </span>'
                // },
                {
                    text: _("modrestaurant.choose_context"),
                    id: "modrestaurant-abtn-choose-context",
                    handler: this.selectContext,
                    scope: this,
                });
        }

        return buttons;
    },
    switchContext: function(ctx) {
        modRestaurant.context = ctx.context;
        var page = Ext.getCmp("modrestaurant-page-create-tabs");
        var grids = ["modrestaurant-grid-mrmenu", "modrestaurant-grid-mrcategory", "modrestaurant-grid-mritem", "modrestaurant-grid-mrextra"];
        Ext.each(grids, function(item, index, allItems) {
            var cmp = Ext.getCmp(item);
            if (cmp) {
                cmp.getStore().baseParams.context = ctx.context;
                cmp.getBottomToolbar().changePage(1);
                cmp.refresh();
            }
        }, this);
        var heading = Ext.getCmp("modrestaurant-header");

        heading.update('<h2>' + _("modrestaurant.management") + ' - ' + ctx.raw + '</h2>');
        page.getEl().unmask();

    },
    getTabs: function(config) {
        var tbs = [];
        tbs.push([
            {
                title: _("modrestaurant.mrmenu_plural"),
                id: "modrestaurant-create-tab-menus",
                autoHeight: true,
                autoScroll: true,
                autoWidth: true,
                bodyCssClass: "vertical-tabs-body",
                defaults: {anchor: "100%"},
                labelAlign: "top",
                layout: "form",
                items: [
                    {
                        xtype: "modrestaurant-grid-gridpanel",
                        record: {
                            class: {
                                name: 'mrMenu',
                                object: 'mrmenu',
                                friendly: _("modrestaurant.mrmenu"),
                                plural: _("modrestaurant.mrmenu_plural")
                            }
                        },
                        save_action: "mgr/mrmenu/updateFromGrid",
                        preventRender: true,
                    },
                ],
            },
            {
                title: _("modrestaurant.mrcategory_plural"),
                id: "modrestaurant-create-tab-categories",
                autoHeight: true,
                autoScroll: true,
                autoWidth: true,
                bodyCssClass: "vertical-tabs-body",
                defaults: {anchor: "100%"},
                labelAlign: "top",
                layout: "form",
                items: [
                    {
                        xtype: "modrestaurant-grid-gridpanel",
                        record: {
                            class: {
                                name: 'mrCategory',
                                object: 'mrcategory',
                                friendly: _("modrestaurant.mrcategory"),
                                plural: _("modrestaurant.mrcategory_plural")
                            }
                        },
                        baseParams: {
                            action: "mgr/mrcategory/getList",
                            context: modRestaurant.context,
                        },
                        save_action: "mgr/mrcategory/updateFromGrid",
                        preventRender: true,
                    }
                ],
            },
            {
                title: _("modrestaurant.mritem_plural"),
                id: "modrestaurant-create-tab-items",
                autoHeight: true,
                autoScroll: true,
                autoWidth: true,
                bodyCssClass: "vertical-tabs-body",
                defaults: {anchor: "100%"},
                labelAlign: "top",
                layout: "form",
                items: [
                    {
                        xtype: "modrestaurant-grid-gridpanel",
                        record: {
                            class: {
                                name: 'mrItem',
                                object: 'mritem',
                                friendly: _("modrestaurant.mritem"),
                                plural: _("modrestaurant.mritem_plural")
                            }
                        },
                        baseParams: {
                            action: "mgr/mritem/getList",
                            context: modRestaurant.context,
                        },
                        save_action: "mgr/mritem/updateFromGrid",
                        preventRender: true,
                    },
                ],

            },
            {
                title: _("modrestaurant.mrextra_plural"),
                id: "modrestaurant-create-tab-extras",
                autoHeight: true,
                autoScroll: true,
                autoWidth: true,
                bodyCssClass: "vertical-tabs-body",
                defaults: {anchor: "100%"},
                labelAlign: "top",
                layout: "form",
                items: [
                    {
                        xtype: "modrestaurant-grid-gridpanel",
                        record: {
                            class: {
                                name: 'mrExtra',
                                object: 'mrextra',
                                friendly: _("modrestaurant.mrextra"),
                                plural: _("modrestaurant.mrextra_plural")
                            }
                        },
                        baseParams: {
                            action: "mgr/mrextra/getList",
                            context: modRestaurant.context,
                        },
                        save_action: "mgr/mrextra/updateFromGrid",
                        preventRender: true,
                    },
                ],

            },
        ]);
        return tbs;
    },
});
Ext.reg("modrestaurant-page-create", modRestaurant.page.Create);