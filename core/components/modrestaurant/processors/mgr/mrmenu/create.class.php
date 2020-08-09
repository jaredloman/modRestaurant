<?php

class mrMenuCreateProcessor extends modObjectCreateProcessor
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

    public function beforeSave()
    {
        $name = $this->getProperty('name');
        $ctx = $this->getProperty('context');
        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('modrestaurant.mrmenu_err_ns_name'));
        } else if (empty($ctx)) {
            $this->addFieldError('context', $this->modx->lexicon('modrestaurant.mrmenu_err_ns_context'));
        }
        return parent::beforeSave();
    }
}

return 'mrMenuCreateProcessor';