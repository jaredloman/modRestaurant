<?php
class mrMenuRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'mrMenu';
    public $languageTopics = array('modrestaurant:default');
    public $objectType = 'modrestaurant.menu';
}
return 'mrMenuRemoveProcessor';