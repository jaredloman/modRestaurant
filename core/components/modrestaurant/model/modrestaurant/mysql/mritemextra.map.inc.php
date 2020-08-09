<?php
$xpdo_meta_map['mrItemExtra']= array (
  'package' => 'modrestaurant',
  'version' => '1.1',
  'table' => 'mr_item_extras',
  'extends' => 'xPDOSimpleObject',
  'tableMeta' => 
  array (
    'engine' => 'MyISAM',
  ),
  'fields' => 
  array (
    'item' => 0,
    'extra' => 0,
    'price' => 0.0,
    'sort' => 0,
  ),
  'fieldMeta' => 
  array (
    'item' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
    'extra' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
    'price' => 
    array (
      'dbtype' => 'decimal',
      'precision' => '5,2',
      'phptype' => 'float',
      'null' => true,
      'default' => 0.0,
    ),
    'sort' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
  ),
  'aggregates' => 
  array (
    'Item' => 
    array (
      'class' => 'mrItem',
      'local' => 'item',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
    'Extra' => 
    array (
      'class' => 'mrExtra',
      'local' => 'extra',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
