<?php

class mrItemExtraCreateProcessor extends modObjectCreateProcessor
{
    public $classKey = 'mrItemExtra';
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
        $item = $this->getProperty('item');
        $extra = $this->getProperty('extra');
        if (empty($item)) {
            $this->addFieldError('item', $this->modx->lexicon('modrestaurant.mritem_err_nf'));
        } else if (empty($extra)) {
            $this->addFieldError('parent', $this->modx->lexicon('modrestaurant.mrextra_err_save'));
        }

        return parent::beforeSave();
    }
}

return 'mrItemExtraCreateProcessor';