<?php

class mrCategoryItemCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'mrCategoryItem';
    public $languageTopics = ['modrestaurant:default'];

    public function beforeSave()
    {
        $price = $this->getProperty('price');
        if (empty($price) || $price == '') {
            //$this->modx->log(modX::LOG_LEVEL_ERROR, 'Properties:' . json_encode($this->properties));
            $this->object->set('price', null);
        } else {
            $price = trim(str_replace($this->modx->lexicon('modrestaurant.currency_symbol'), '', $price));
            $this->object->set('price', $price);
        }
        $category = $this->getProperty('category');
        $item = $this->getProperty('item');
        if (empty($item)) {
            $this->addFieldError('item', $this->modx->lexicon('modrestaurant.mritem_err_nf'));
        } else if (empty($category)) {
            $this->addFieldError('category', $this->modx->lexicon('modrestaurant.mrcategory_err_save'));
        }

        return parent::beforeSave();
    }
}

return 'mrCategoryItemCreateProcessor';