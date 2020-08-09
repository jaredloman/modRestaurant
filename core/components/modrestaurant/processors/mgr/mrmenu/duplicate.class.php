<?php
class mrMenuDuplicateProcessor extends modObjectDuplicateProcessor {
    public $classKey = 'mrMenu';
    public $languageTopics = array('modrestaurant:default');
    public $objectType = 'modrestaurant.menu';
}
return 'mrMenuDuplicateProcessor';