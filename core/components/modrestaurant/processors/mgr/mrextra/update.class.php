<?php

class mrExtraUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'mrExtra';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.extra';

    public function beforeSet()
    {
        $a = 0;
        $active = $this->getProperty('active');
        $price = $this->getProperty('price');

        if ($active == 'on') {
            $a = 1;
        }
        if (!empty($price)) {
            $price = trim(str_replace($this->modx->lexicon('modrestaurant.currency_symbol'), '', $price));
        }

        // Set Properties
        $this->setProperty('active', $a);
        $this->setProperty('price', $price);

        return parent::beforeSet();
    }
}

return 'mrExtraUpdateProcessor';