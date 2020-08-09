Ext.grid.ModActionColumn = Ext.extend(Ext.grid.Column, {
    /**
     * @cfg {String} icon
     * The URL of an image to display as the clickable element in the column.
     * Optional - defaults to <code>{@link Ext#BLANK_IMAGE_URL Ext.BLANK_IMAGE_URL}</code>.
     */
    /**
     * @cfg {String} iconCls
     * A CSS class to apply to the icon image. To determine the class dynamically, configure the Column with a <code>{@link #getClass}</code> function.
     */
    /**
     * @cfg {Function} handler A function called when the icon is clicked.
     * The handler is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>grid</code> : GridPanel<div class="sub-desc">The owning GridPanel.</div></li>
     * <li><code>rowIndex</code> : Number<div class="sub-desc">The row index clicked on.</div></li>
     * <li><code>colIndex</code> : Number<div class="sub-desc">The column index clicked on.</div></li>
     * <li><code>item</code> : Object<div class="sub-desc">The clicked item (or this Column if multiple
     * {@link #items} were not configured).</div></li>
     * <li><code>e</code> : Event<div class="sub-desc">The click event.</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Object} scope The scope (<tt><b>this</b></tt> reference) in which the <code>{@link #handler}</code>
     * and <code>{@link #getClass}</code> fuctions are executed. Defaults to this Column.
     */
    /**
     * @cfg {String} tooltip A tooltip message to be displayed on hover. {@link Ext.QuickTips#init Ext.QuickTips} must have
     * been initialized.
     */
    /**
     * @cfg {Boolean} stopSelection Defaults to <code>true</code>. Prevent grid <i>row</i> selection upon mousedown.
     */
    /**
     * @cfg {Function} getClass A function which returns the CSS class to apply to the icon image.
     * The function is passed the following parameters:<div class="mdetail-params"><ul>
     *     <li><b>v</b> : Object<p class="sub-desc">The value of the column's configured field (if any).</p></li>
     *     <li><b>metadata</b> : Object<p class="sub-desc">An object in which you may set the following attributes:<ul>
     *         <li><b>css</b> : String<p class="sub-desc">A CSS class name to add to the cell's TD element.</p></li>
     *         <li><b>attr</b> : String<p class="sub-desc">An HTML attribute definition string to apply to the data container element <i>within</i> the table cell
     *         (e.g. 'style="color:red;"').</p></li>
     *     </ul></p></li>
     *     <li><b>r</b> : Ext.data.Record<p class="sub-desc">The Record providing the data.</p></li>
     *     <li><b>rowIndex</b> : Number<p class="sub-desc">The row index..</p></li>
     *     <li><b>colIndex</b> : Number<p class="sub-desc">The column index.</p></li>
     *     <li><b>store</b> : Ext.data.Store<p class="sub-desc">The Store which is providing the data Model.</p></li>
     * </ul></div>
     */
    /**
     * @cfg {Array} items An Array which may contain multiple icon definitions, each element of which may contain:
     * <div class="mdetail-params"><ul>
     * <li><code>icon</code> : String<div class="sub-desc">The url of an image to display as the clickable element
     * in the column.</div></li>
     * <li><code>iconCls</code> : String<div class="sub-desc">A CSS class to apply to the icon image.
     * To determine the class dynamically, configure the item with a <code>getClass</code> function.</div></li>
     * <li><code>getClass</code> : Function<div class="sub-desc">A function which returns the CSS class to apply to the icon image.
     * The function is passed the following parameters:<ul>
     *     <li><b>v</b> : Object<p class="sub-desc">The value of the column's configured field (if any).</p></li>
     *     <li><b>metadata</b> : Object<p class="sub-desc">An object in which you may set the following attributes:<ul>
     *         <li><b>css</b> : String<p class="sub-desc">A CSS class name to add to the cell's TD element.</p></li>
     *         <li><b>attr</b> : String<p class="sub-desc">An HTML attribute definition string to apply to the data container element <i>within</i> the table cell
     *         (e.g. 'style="color:red;"').</p></li>
     *     </ul></p></li>
     *     <li><b>r</b> : Ext.data.Record<p class="sub-desc">The Record providing the data.</p></li>
     *     <li><b>rowIndex</b> : Number<p class="sub-desc">The row index..</p></li>
     *     <li><b>colIndex</b> : Number<p class="sub-desc">The column index.</p></li>
     *     <li><b>store</b> : Ext.data.Store<p class="sub-desc">The Store which is providing the data Model.</p></li>
     * </ul></div></li>
     * <li><code>handler</code> : Function<div class="sub-desc">A function called when the icon is clicked.</div></li>
     * <li><code>scope</code> : Scope<div class="sub-desc">The scope (<code><b>this</b></code> reference) in which the
     * <code>handler</code> and <code>getClass</code> functions are executed. Fallback defaults are this Column's
     * configured scope, then this Column.</div></li>
     * <li><code>tooltip</code> : String<div class="sub-desc">A tooltip message to be displayed on hover.
     * {@link Ext.QuickTips#init Ext.QuickTips} must have been initialized.</div></li>
     * </ul></div>
     */
    header: '&#160;',

    actionIdRe: /x-action-col-(\d+)/,

    /**
     * @cfg {String} altText The alt text to use for the image element. Defaults to <tt>''</tt>.
     */
    altText: '',

    constructor: function(cfg) {
        var me = this,
            items = cfg.items || (me.items = [me]),
            l = items.length,
            i,
            item;

        Ext.grid.ActionColumn.superclass.constructor.call(me, cfg);

//      Renderer closure iterates through items creating an <img> element for each and tagging with an identifying
//      class name x-action-col-{n}
        me.renderer = function(v, meta) {
//          Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
            v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments) || '' : '';

            meta.css += ' x-modaction-col-cell';
            for (i = 0; i < l; i++) {
                item = items[i];

                var fas = item.fas ? true : false;

                if (fas) {
                    v += '<i class="x-action-col-icon x-action-col-' + String(i) + ' ' + (item.iconCls || '') +
                        ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || this.scope || this, arguments) : '') + '"' +
                        ((item.tooltip) ? ' ext:qtip="' + item.tooltip + '"' : '') + '></i>';
                } else {
                    v += '<img alt="' + (item.altText || me.altText) + '" src="' + (item.icon || Ext.BLANK_IMAGE_URL) +
                        '" class="x-action-col-icon x-action-col-' + String(i) + ' ' + (item.iconCls || '') +
                        ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope || this.scope || this, arguments) : '') + '"' +
                        ((item.tooltip) ? ' ext:qtip="' + item.tooltip + '"' : '') + '/>';
                }
            }
            return v;
        };
    },

    destroy: function() {
        delete this.items;
        delete this.renderer;
        return Ext.grid.ActionColumn.superclass.destroy.apply(this, arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     * Also fires any configured click handlers. By default, cancels the mousedown event to prevent selection.
     * Returns the event handler's status to allow cancelling of GridView's bubbling process.
     */
    processEvent: function(name, e, grid, rowIndex, colIndex) {
        var m = e.getTarget().className.match(this.actionIdRe),
            item, fn;
        if (m && (item = this.items[parseInt(m[1], 10)])) {
            if (name == 'click') {
                (fn = item.handler || this.handler) && fn.call(item.scope || this.scope || this, grid, rowIndex, colIndex, item, e);
            } else if ((name == 'mousedown') && (item.stopSelection !== false)) {
                return false;
            }
        }
        return Ext.grid.ActionColumn.superclass.processEvent.apply(this, arguments);
    }
});


Ext.grid.Column.types.modactioncolumn = Ext.grid.ModActionColumn;