<?php

class mrItemGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'mrItem';
    public $languageTopics = ['modrestaurant:default'];
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'modrestaurant.item';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');
        $context = $this->getProperty('context');
        $filter = $this->getProperty('filter');
        $parent = $this->getProperty('parent');
        if (!empty($filter) && !empty($parent)) {
            $q = $this->modx->newQuery('mrCategoryItem');
            $q->where(['category' => $parent]);
            $q->select(['item']);
            $q->prepare();
            //$this->modx->log(modX::LOG_LEVEL_ERROR, 'The Query:' . $q->toSQL());
            $collection = $this->modx->getIterator('mrCategoryItem', $q);
            $attached = [];
            foreach ($collection as $row) {
                $attached[] = $row->get('item');
            }
            //$this->modx->log(modX::LOG_LEVEL_ERROR, 'The Collection:' . json_encode($attached));
            if (count($attached)) {
                $c->where([
                    'id:NOT IN' => $attached,
                ]);
            }
        }
        if (!empty($query)) {
            $c->where([
                'name:LIKE' => '%' . $query . '%',
                'OR:description:LIKE' => '%' . $query . '%',
            ]);
        }
        if (!empty($context)) {
            $c->where(['context' => $context]);
        }
        return $c;
    }

    public function prepareRow(xPDOObject $object)
    {
        $ta = $object->toArray('', false, true, true);
        if ($ta['active'] === 1) {
            $ta['active'] = 'on';
        } else {
            $ta['active'] = 'off';
        }
        if ($ta['featured'] === 1) {
            $ta['featured'] = 'on';
        } else {
            $ta['featured'] = 'off';
        }
        return $ta;
    }
}

return 'mrItemGetListProcessor';