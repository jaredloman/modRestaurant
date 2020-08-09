<?php

class mrCategoryCreateProcessor extends modObjectCreateProcessor
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

    public function beforeSave()
    {
        $name = $this->getProperty('name');
        $ctx = $this->getProperty('context');
        if (empty($name)) {
            $this->addFieldError('name', $this->modx->lexicon('modrestaurant.mrcategory_err_ns_name'));
        } else if (empty($ctx)) {
            $this->addFieldError('context', $this->modx->lexicon('modrestaurant.mrcategory_err_ns_context'));
        }
        return parent::beforeSave();
    }
}

return 'mrCategoryCreateProcessor';