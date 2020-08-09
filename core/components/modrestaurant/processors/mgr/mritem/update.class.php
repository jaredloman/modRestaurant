<?php

class mrItemUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'mrItem';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.item';

    public function beforeSet()
    {
        $a = 0;
        $f = 0;
        $active = $this->getProperty('active');
        $featured = $this->getProperty('featured');
        $price = $this->getProperty('price');

        if ($active == 'on') {
            $a = 1;
        }
        if ($featured == 'on') {
            $f = 1;
        }
        if (!empty($price)) {
            $price = trim(str_replace($this->modx->lexicon('modrestaurant.currency_symbol'), '', $price));
        }

        // Set Properties
        $this->setProperty('active', $a);
        $this->setProperty('featured', $f);
        $this->setProperty('price', $price);

        return parent::beforeSet();
    }
}

return 'mrItemUpdateProcessor';