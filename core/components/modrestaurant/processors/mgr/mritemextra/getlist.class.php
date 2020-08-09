<?php

class mrItemExtraGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'mrItemExtra';
    public $languageTopics = ['modrestaurant:default'];
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';

    public function initialize()
    {
        $this->setDefaultProperties([
            'extra' => 0,
        ]);
        return parent::initialize();
    }

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');

        $c->innerJoin('mrExtra', 'Extra');

        $c->where([
            'mrItemExtra.item' => $this->getProperty('parent'),
        ]);

        if (!empty($query)) {
            $c->where([
                'Extra.name:LIKE' => '%' . $query . '%',
                'OR:Extra.description:LIKE' => '%' . $query . '%',
            ]);
        }

        return $c;
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->select($this->modx->getSelectColumns('mrExtra', 'Extra'));
        $c->select([
            'id' => 'mrItemExtra.id',
            'name' => 'Extra.name',
            'description' => 'Extra.description',
            'price' => 'Extra.price',
            'sort' => 'mrItemExtra.sort',
        ]);
        return $c;
    }
}

return 'mrItemExtraGetListProcessor';