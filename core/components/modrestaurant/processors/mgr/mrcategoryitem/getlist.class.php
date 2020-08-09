<?php

class mrCategoryItemGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'mrCategoryItem';
    public $languageTopics = ['modrestaurant:default'];
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';

    public function initialize()
    {
        $this->setDefaultProperties([
            'item' => 0,
        ]);
        return parent::initialize();
    }

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');

        $c->innerJoin('mrItem', 'Item');

        $c->where([
            'mrCategoryItem.category' => $this->getProperty('parent'),
        ]);

        if (!empty($query)) {
            $c->where([
                'Item.name:LIKE' => '%' . $query . '%',
                'OR:Item.description:LIKE' => '%' . $query . '%',
            ]);
        }

        return $c;
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->select($this->modx->getSelectColumns('mrItem', 'Item'));
        $c->select([
            'id' => 'mrCategoryItem.id',
            'name' => 'Item.name',
            'description' => 'Item.description',
            'price' => 'mrCategoryItem.price',
            'sort' => 'mrCategoryItem.sort',
        ]);
        return $c;
    }
}

return 'mrCategoryItemGetListProcessor';