<?php
require_once dirname(dirname(dirname(__FILE__))) . '/model/modrestaurant/modrestaurant.class.php';

class modRestaurantUpdateManagerController extends modExtraManagerController
{
    public $modrestaurant;

    public function initialize()
    {
        $this->modrestaurant = new modRestaurant($this->modx);
        $this->addCss($this->modrestaurant->config['cssUrl'] . 'mgr.css?a=1');
        $this->addCss($this->modrestaurant->config['cssUrl'] . 'all.min.css');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/modrestaurant.js');
        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                modRestaurant.config = ' . $this->modx->toJSON($this->modrestaurant->config) . ';
                modRestaurant.config.record = {};
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

        $id = $this->modx->getOption('id', $scriptProperties, 0);
        $className = $this->modx->getOption('className', $scriptProperties, 'mrMenu');
        $subClassName = 'mrCategory';
        if ($className == 'mrCategory') {
            $subClassName = 'mrItem';
        }
        if ($className == 'mrItem') {
            $subClassName = 'mrExtra';
        }
        $classes = ['mrMenu', 'mrCategory', 'mrItem', 'mrExtra'];
        if ($id) {
            if (in_array($className, $classes)) {
                $record = $this->modx->getObject($className, $id);
                if (!empty($record)) {
                    $ra = $record->toArray();
                    $lsingle = 'modrestaurant.' . strtolower($className);
                    $lplural = $lsingle . '_plural';
                    $ra['class']['name'] = $className;
                    $ra['class']['object'] = strtolower($className);
                    $ra['class']['friendly'] = $this->modx->lexicon($lsingle);
                    $ra['class']['plural'] = $this->modx->lexicon($lplural);
                    $ra['class']['parent'] = 'menu';
                    $ra['class']['child'] = 'category';
                    $ra['subClass']['name'] = 'mrCategory';
                    $ra['subClass']['object'] = 'mrcategory';
                    $ra['subClass']['friendly'] = $this->modx->lexicon('modrestaurant.mrcategory');
                    $ra['subClass']['plural'] = $this->modx->lexicon('modrestaurant.mrcategory_plural');
                    $ra['subClass']['parent'] = 'menu';
                    $ra['subClass']['child'] = 'category';
                    $ra['pivot']['name'] = 'mrMenuCategory';
                    $ra['pivot']['object'] = 'mrmenucategory';
                    if ($className == 'mrCategory') {
                        $ra['class']['parent'] = 'category';
                        $ra['class']['child'] = 'item';
                        $ra['subClass']['name'] = 'mrItem';
                        $ra['subClass']['object'] = 'mritem';
                        $ra['subClass']['friendly'] = $this->modx->lexicon('modrestaurant.mritem');
                        $ra['subClass']['plural'] = $this->modx->lexicon('modrestaurant.mritem_plural');
                        $ra['subClass']['parent'] = 'category';
                        $ra['subClass']['child'] = 'item';
                        $ra['pivot']['name'] = 'mrCategoryItem';
                        $ra['pivot']['object'] = 'mrcategoryitem';
                    } else if ($className == 'mrItem') {
                        $ra['class']['parent'] = 'item';
                        $ra['class']['child'] = 'extra';
                        $ra['subClass']['name'] = 'mrExtra';
                        $ra['subClass']['object'] = 'mrextra';
                        $ra['subClass']['friendly'] = $this->modx->lexicon('modrestaurant.mrextra');
                        $ra['subClass']['plural'] = $this->modx->lexicon('modrestaurant.mrextra_plural');
                        $ra['subClass']['parent'] = 'item';
                        $ra['subClass']['child'] = 'extra';
                        $ra['pivot']['name'] = 'mrItemExtra';
                        $ra['pivot']['object'] = 'mritemextra';
                    }
                    $this->addHtml('<script type="text/javascript">
                      Ext.onReady(function() {
                        modRestaurant.config.record = ' . json_encode($ra) . ';
                      });
                    </script>');
                }
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
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/overrides.js');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/windows.js?a=41');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/grids.js?a=63');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/combos.js?a=24');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/panels.js?a=62');
        $this->addJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/widgets/inputs.js');
        $this->addLastJavascript($this->modrestaurant->config['jsUrl'] . 'mgr/sections/update.js?a=90');
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
        return 'update.tpl';
    }
}