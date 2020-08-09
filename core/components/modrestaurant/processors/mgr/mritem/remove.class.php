<?php

class mrItemRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'mrItem';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.item';
}

return 'mrItemRemoveProcessor';