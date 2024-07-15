import '@archetype-themes/scripts/config';
import '@archetype-themes/scripts/modules/collapsibles';
import '@archetype-themes/scripts/modules/video-modal';
import '@archetype-themes/scripts/modules/animation-observer';
import '@archetype-themes/scripts/modules/page-transitions';
import '@archetype-themes/scripts/helpers/rte';
import '@archetype-themes/scripts/modules/tool-tip';
import '@archetype-themes/scripts/modules/tool-tip-trigger';
import Animape from '@archetype-themes/scripts/vendors/animape';

// Load generic JS. Also reinitializes when sections are
// added, edited, or removed in Shopify's editor
theme.initGlobals = function() {
  theme.collapsibles.init();
  theme.videoModal();
  theme.animationObserver();
  theme.pageTransitions();
  theme.rteInit();

  const animape = new Animape();
  animape.init({
    distance: 150
  });
}
