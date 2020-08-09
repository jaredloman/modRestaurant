<?php

class mrExtraDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'mrExtra';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.extra';
}

return 'mrExtraDuplicateProcessor';