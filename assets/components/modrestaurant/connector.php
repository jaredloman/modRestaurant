<?php
require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';
$corePath = $modx->getOption('modrestaurant.core_path',null,$modx->getOption('core_path').'components/modrestaurant/');
require_once $corePath.'model/modrestaurant/modrestaurant.class.php';
$modx->modrestaurant = new modRestaurant($modx);
$modx->lexicon->load('modrestaurant:default');
/* handle request */
$path = $modx->getOption('processorsPath',$modx->modrestaurant->config,$corePath.'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));