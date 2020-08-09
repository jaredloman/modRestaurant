<?php

class mrMenuCategoryUpdateProcessor extends modObjectUpdateProcessor
{
    public $classKey = 'mrMenuCategory';
    public $languageTopics = ['modrestaurant:default'];
    public $objectType = 'modrestaurant.menucategory';
}

return 'mrMenuCategoryUpdateProcessor';