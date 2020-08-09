<?php

class mrMenuGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'mrMenu';
    public $languageTopics = ['modrestaurant:default'];
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'modrestaurant.menu';

    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $query = $this->getProperty('query');
        $context = $this->getProperty('context');
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

return 'mrMenuGetListProcessor';