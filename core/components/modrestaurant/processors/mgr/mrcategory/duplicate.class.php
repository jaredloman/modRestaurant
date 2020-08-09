<?php

class mrCategoryDuplicateProcessor extends modObjectDuplicateProcessor
{
    public $classKey = 'mrCategory';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.category';
}

return 'mrCategoryDuplicateProcessor';