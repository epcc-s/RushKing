import '@archetype-themes/scripts/config';
import Swatches from '@archetype-themes/scripts/modules/swatches';

class ProductGridItem extends HTMLElement {
  constructor() {
    super();

    this.swatches = new Swatches(this);

    document.dispatchEvent(new CustomEvent('product-grid-item:loaded'));
  }
}

customElements.define('product-grid-item', ProductGridItem);
