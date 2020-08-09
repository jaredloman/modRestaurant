<?php

class mrCategoryRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'mrCategory';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.category';
}

return 'mrCategoryRemoveProcessor';