<?php

class mrExtraGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'mrExtra';
    public $languageTopics = ['modrestaurant:default'];
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'modrestaurant.extra';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');
        $context = $this->getProperty('context');
        $filter = $this->getProperty('filter');
        $parent = $this->getProperty('parent');
        if (!empty($filter) && !empty($parent)) {
            $q = $this->modx->newQuery('mrItemExtra');
            $q->where(['item' => $parent]);
            $q->select(['extra']);
            $q->prepare();
            //$this->modx->log(modX::LOG_LEVEL_ERROR, 'The Query:' . $q->toSQL());
            $collection = $this->modx->getIterator('mrItemExtra', $q);
            $attached = [];
            foreach ($collection as $row) {
                $attached[] = $row->get('extra');
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
        return $ta;
    }
}

return 'mrExtraGetListProcessor';