<?php
$modrestaurant = $modx->getService('modrestaurant', 'modRestaurant', $modx->getOption('modrestaurant.core_path', null, $modx->getOption('core_path') . 'components/modrestaurant/') . 'model/modrestaurant/', $scriptProperties);
if (!($modrestaurant instanceof modRestaurant)) {
    return '';
}
/* Default Properties */
$contextAware = $modx->getOption('modrestaurant.context_aware', $scriptProperties, false);
$ctx = $modx->getOption('context', $scriptProperties, 'web');
$sort = $modx->getOption('sort', $scriptProperties, 'sort');
$dir = $modx->getOption('dir', $scriptProperties, 'ASC');
$showInactive = $modx->getOption('showInactive', $scriptProperties, false);
$debug = $modx->getOption('debug', $scriptProperties, false);

/* Templates */
$menuTpl = $modx->getOption('menuTpl', $scriptProperties, 'menuTpl');
$menuOuterTpl = $modx->getOption('menuOuterTpl', $scriptProperties, 'menuOuterTpl');
$categoryTpl = $modx->getOption('categoryTpl', $scriptProperties, 'categoryTpl');
$itemTpl = $modx->getOption('itemTpl', $scriptProperties, 'itemTpl');
$extraTpl = $modx->getOption('extraTpl', $scriptProperties, 'extraTpl');


$c = $modx->newQuery('mrMenu');

if (!$debug && !$showInactive) {
    $c->where(['active' => 1]);
}
if ($contextAware) {
    $c->where(['context' => $ctx]);
}
$c->sortby($sort, $dir);

if ($debug) {
    $c->prepare();
    $modx->log(modX::LOG_LEVEL_ERROR, 'Query:' . $c->toSQL());
}

// Get the Menu and all relations
//$menus = $modx->getCollectionGraph('mrMenu', '{ "MenuCategories":{ "Category":{ "CategoryItems": { "Item": { "ItemExtras": { "Extra": {} } } } } } }', $c);
$menus = $modx->getIterator('mrMenu', $c);
$menuArray = [];

if ($menus) {
    foreach ($menus as $menu) {
        $ma = $menu->toArray();
        if ($debug) {
            $modx->log(modX::LOG_LEVEL_ERROR, 'Menu:' . json_encode($ma));
        }

        // Query MenuCategory Pivot
        $q = $modx->newQuery('mrCategory');
        $q->innerJoin('mrMenuCategory', 'MenuCategory', 'mrCategory.id = MenuCategory.category');
        $q->where([
            'MenuCategory.menu' => $menu->get('id'),
            'mrCategory.active' => 1,
        ]);

        $q->sortby('MenuCategory.' . $sort, $dir);
        if ($debug) {
            $q->prepare();
            $modx->log(modX::LOG_LEVEL_ERROR, 'MenuCategory Query:' . $q->toSQL());
        }
        // Get Categories
        $categories = $modx->getIterator('mrCategory', $q);
        $categoryArray = [];

        // Loop Categories
        if ($categories) {
            foreach ($categories as $category) {
                $ca = $category->toArray();

                // Now get the Category Items Pivot
                $v = $modx->newQuery('mrItem');
                $v->innerJoin('mrCategoryItem', 'CategoryItem', 'mrItem.id = CategoryItem.item');
                $v->where([
                    'CategoryItem.category' => $category->get('id'),
                    'mrItem.active' => 1,
                ]);
                $v->sortby('CategoryItem.' . $sort, $dir);
                if ($debug) {
                    $v->prepare();
                    $modx->log(modX::LOG_LEVEL_ERROR, 'CategoryItem Query:' . $v->toSQL());
                }
                // Get Items
                $items = $modx->getIterator('mrItem', $v);
                $itemArray = [];
                if ($items) {
                    foreach ($items as $item) {
                        $ia = $item->toArray();

                        // Now get the ItemExtras Pivot
                        $w = $modx->newQuery('mrExtra');
                        $w->innerJoin('mrItemExtra', 'ItemExtra', 'mrExtra.id = ItemExtra.extra');
                        $w->where([
                            'ItemExtra.item' => $item->get('id'),
                            'mrExtra.active' => 1,
                        ]);
                        $w->sortby('ItemExtra.' . $sort, $dir);
                        if ($debug) {
                            $w->prepare();
                            $modx->log(modX::LOG_LEVEL_ERROR, 'ItemExtra Query:' . $w->toSQL());
                        }
                        $extras = $modx->getIterator('mrExtra', $w);
                        $extrasArray = [];
                        if ($extras) {
                            foreach ($extras as $extra) {
                                $ea = $extra->toArray();

                                if ($debug) {
                                    $extrasArray[] = $ea;
                                } else {
                                    $extrasArray[] = $modrestaurant->getChunk($extraTpl, $ea);
                                }
                            }
                            $ia['extras'] = implode($extrasArray);
                        }
                        if ($debug) {
                            $itemArray[] = $ia;
                        } else {
                            $itemArray[] = $modrestaurant->getChunk($itemTpl, $ia);
                        }
                    }
                    $ca['items'] = implode($itemArray);
                }
                if ($debug) {
                    $categoryArray[] = $ca;
                } else {
                    $categoryArray[] = $modrestaurant->getChunk($categoryTpl, $ca);
                }
            }
            $ma['categories'] = implode($categoryArray);
        }
        $menuArray[] = $modrestaurant->getChunk($menuTpl, $ma);
    }
}

if ($debug) {
    $output = '<pre>' . json_encode($menuArray) . '</pre>';
} else {
    $output = $modrestaurant->getChunk($menuOuterTpl, ['menus' => implode($menuArray)]);
}

return $output;