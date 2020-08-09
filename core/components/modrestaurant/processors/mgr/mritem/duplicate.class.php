<?php

class mrItemDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'mrItem';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.item';
}

return 'mrItemDuplicateProcessor';