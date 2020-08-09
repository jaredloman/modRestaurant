<?php

class mrCategoryUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'mrCategory';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.category';

    public function beforeSet()
    {
        $active = $this->getProperty('active');
        $a = 0;
        if ($active == 'on') {
            $a = 1;
        }
        $this->setProperty('active', $a);
        return parent::beforeSet();
    }
}

return 'mrCategoryUpdateProcessor';