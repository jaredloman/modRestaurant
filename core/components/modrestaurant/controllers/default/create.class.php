<?php
require_once dirname(dirname(dirname(__FILE__))) . '/model/modrestaurant/modrestaurant.class.php';

class modRestaurantCreateManagerController extends modExtraManagerController
{
    public $modrestaurant;

    public function initialize()
    {
        $this->modrestaurant = new modRestaurant($this->modx);
        $this->addCss($this->modrestaurant->config['cssUrl'] . 'mgr.css');
        $this->addCss($this->modrestaurant->config['cssUrl'] . 'all.min.css');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/modrestaurant.js');
        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                modRestaurant.config = ' . $this->modx->toJSON($this->modrestaurant->config) . ';
            });
        </script>');

        return parent::initialize();
    }

    public function getLanguageTopics()
    {
        return ['modrestaurant:default'];
    }

    public function checkPermissions()
    {
        return true;
    }

    public function process(array $scriptProperties = [])
    {
        if (array_key_exists('context', $scriptProperties) && $this->modx->getOption('modrestaurant.context_aware')) {
            $key = $scriptProperties['context'];
            $context = $this->modx->getObject('modContext', ['key' => $key]);
            if ($context instanceof modContext) {

                $this->addHtml('<script type="text/javascript">
                    Ext.onReady(function() {
                        modRestaurant.initialContext = ' . $context->toJSON() . ';
                        modRestaurant.context = "' . $key . '";
                    });
                </script>');
            }
        }

        $this->loadRichTextEditor();
    }

    public function loadRichTextEditor()
    {
        $useEditor = $this->modx->getOption('use_editor');
        $whichEditor = $this->modx->getOption('which_editor');
        if ($useEditor && !empty($whichEditor)) {
            /* invoke OnRichTextEditorInit event */
            $onRichTextEditorInit = $this->modx->invokeEvent('OnRichTextEditorInit', [
                'editor' => $whichEditor,
                'elements' => ['foo'],
            ]);
            if (is_array($onRichTextEditorInit)) {
                $onRichTextEditorInit = implode('', $onRichTextEditorInit);
            }
            $this->setPlaceholder('onRichTextEditorInit', $onRichTextEditorInit);
        }
    }

    public function getPageTitle()
    {
        return $this->modx->lexicon('modrestaurant');
    }

    public function loadCustomCssJs()
    {
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/combos.js');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/inputs.js');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/windows.js?a=22');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/grids.js?a=61');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/overrides.js');
        $this->addLastJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/sections/create.js?a=35');
        $contextAware = $this->modx->getOption('modrestaurant.context_aware') ? 'true' : 'false';
        $whichEditor = $this->modx->getOption('which_editor');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            modRestaurant.contextAware = ' . $contextAware . ';
//            modRestaurant.rte = ' . $whichEditor . ';
//            modRestaurant.rte.options = {
//                "air": true,
//                "buttons": ["format", "divider", "bold", "italic", "link", "html"],
//                "minHeight": 50,
//                //"paragraphize": false,
//                // "replaceDivs": false,
//                // "linebreaks": true,
//                // "enterKey": false
//            };
        });
        </script>');
    }

    public function getTemplateFile()
    {
        return 'create.tpl';
    }
}