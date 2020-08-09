<?php

class mrMenuCategoryGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'mrMenuCategory';
    public $languageTopics = ['modrestaurant:default'];
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';

    public function initialize()
    {
        $this->setDefaultProperties([
            'category' => 0,
        ]);
        return parent::initialize();
    }

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');

        $c->innerJoin('mrCategory', 'Category');

        $c->where([
            'mrMenuCategory.menu' => $this->getProperty('parent'),
        ]);

        if (!empty($query)) {
            $c->where([
                'Category.name:LIKE' => '%' . $query . '%',
                'OR:Category.description:LIKE' => '%' . $query . '%',
            ]);
        }

        return $c;
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->select($this->modx->getSelectColumns('mrCategory', 'Category'));
        $c->select([
            'id' => 'mrMenuCategory.id',
            'name' => 'Category.name',
            'description' => 'Category.description',
            'sort' => 'mrMenuCategory.sort',
        ]);
        return $c;
    }
}

return 'mrMenuCategoryGetListProcessor';