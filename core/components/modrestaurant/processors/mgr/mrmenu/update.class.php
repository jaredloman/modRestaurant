<?php

class mrMenuUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'mrMenu';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.menu';

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

return 'mrMenuUpdateProcessor';