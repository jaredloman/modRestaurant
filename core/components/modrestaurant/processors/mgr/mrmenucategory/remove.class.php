<?php

class mrMenuCategoryRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'mrMenuCategory';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.menucategory';
}

return 'mrMenuCategoryRemoveProcessor';