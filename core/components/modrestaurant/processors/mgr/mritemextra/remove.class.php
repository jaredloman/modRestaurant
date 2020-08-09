<?php

class mrCategoryItemRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'mrCategoryItem';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.categoryitem';
}

return 'mrCategoryItemRemoveProcessor';