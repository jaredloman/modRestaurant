<?php

class mrMenuCategoryCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'mrMenuCategory';
    public $languageTopics = ['modrestaurant:default'];

    public function beforeSave()
    {
        $menu = $this->getProperty('menu');
        //$this->modx->log(modX::LOG_LEVEL_ERROR, 'Menu:' . $menu);
        $category = $this->getProperty('category');
        if (empty($menu)) {
            $this->addFieldError('menu', $this->modx->lexicon('modrestaurant.mrmenu_err_nf'));
        } else if (empty($category)) {
            $this->addFieldError('category', $this->modx->lexicon('modrestaurant.mrcategory_err_save'));
        }
        return parent::beforeSave();
    }
}

return 'mrMenuCategoryCreateProcessor';