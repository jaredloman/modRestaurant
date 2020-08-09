<?php

class modRestaurant
{
    public $modx;
    public $config = [];

    public function __construct(modX &$modx, array $config = [])
    {
        $this->modx =& $modx;
        $basePath = $this->modx->getOption('modrestaurant.core_path', $config, $this->modx->getOption('core_path') . 'components/modrestaurant/');
        $assetsUrl = $this->modx->getOption('modrestaurant.assets_url', $config, $this->modx->getOption('assets_url') . 'components/modrestaurant/');
        $assetsPath = $this->modx->getOption('modrestaurant.assets_path', $config, $this->modx->getOption('assets_path') . 'components/modrestaurant/');
        $redactorConfig = $this->modx->getOption('modrestaurant.redactor_config', $config, false);
        $mediasourceId = $this->modx->getOption('modrestaurant.mediasource_id', $config, '1');
//        $ctxs = $this->modx->getCollection('modContext', ['key:NOT IN' => ['mgr']]);
//        $contexts = [];
//        if ($ctxs) {
//            foreach ($ctxs as $c) {
//                $contexts[] = $c->toArray();
//            }
//        }
        $this->modx->loadClass('sources.modFileMediaSource');
        $this->modx->loadClass('sources.modMediaSource');
        $msource = $this->modx->getObject('modFileMediaSource', $mediasourceId);
        $msource->initialize();
        $mpath = $msource->getBases('');
        $mediasourcePath = $mpath['url'];
        $this->config = array_merge([
            'basePath' => $basePath,
            'corePath' => $basePath,
            'modelPath' => $basePath . 'model/',
            'processorsPath' => $basePath . 'processors/',
            'templatesPath' => $basePath . 'templates/',
            'chunksPath' => $basePath . 'elements/chunks/',
            'jsUrl' => $assetsUrl . 'js/',
            'cssUrl' => $assetsUrl . 'css/',
            'assetsUrl' => $assetsUrl,
            'assetsPath' => $assetsPath,
            'connectorUrl' => $assetsUrl . 'connector.php',
            'mediasourceId' => $mediasourceId,
            'mediasourcePath' => $mediasourcePath,
            'redactorConfig' => $redactorConfig,
//            'contexts' => $contexts,
        ], $config);
        $this->modx->addPackage('modrestaurant', $this->config['modelPath']);
    }

    public function processImagePath($image)
    {
        if (!empty($image)) {
            // Get Media Source ID
            $mediasourceId = $this->modx->getOption('modrestaurant.mediasource_id', (integer)1, (integer)1);
            //Load MediaSource Class
            $this->modx->loadClass('sources.modFileMediaSource');
            $this->modx->loadClass('sources.modMediaSource');
            //Get Media Source Path from ID
            $msource = $this->modx->getObject('modFileMediaSource', $mediasourceId);
            $msource->initialize();
            $mpath = $msource->getBases('');
            $mediasourcePath = $mpath['url'];
            $image = $mediasourcePath . $image;
            return $image;
        } else {
            return '';
        }
    }

    public function getChunk($name, $properties = [])
    {
        $chunk = null;
        if (!isset($this->chunks[$name])) {
            $chunk = $this->modx->getObject('modChunk', ['name' => $name]);
            if (empty($chunk) || !is_object($chunk)) {
                $chunk = $this->_getTplChunk($name);
                if ($chunk == false) {
                    return false;
                }
            }
            $this->chunks[$name] = $chunk->getContent();
        } else {
            $o = $this->chunks[$name];
            $chunk = $this->modx->newObject('modChunk');
            $chunk->setContent($o);
        }
        $chunk->setCacheable(false);
        return $chunk->process($properties);
    }

    private function _getTplChunk($name, $postfix = '.chunk.tpl')
    {
        $chunk = false;
        $f = $this->config['chunksPath'] . strtolower($name) . $postfix;
        if (file_exists($f)) {
            $o = file_get_contents($f);
            $chunk = $this->modx->newObject('modChunk');
            $chunk->set('name', $name);
            $chunk->setContent($o);
        }
        return $chunk;
    }
}