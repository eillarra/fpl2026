import { defineBoot } from '#q-app';

import FplBtn from '@/components/FplBtn.vue';
import FplSubtitle from '@/components/FplSubtitle.vue';
import MarkedDiv from '@evan/components/MarkedDiv.vue';

export default defineBoot(({ app }) => {
  app.component('FplBtn', FplBtn);
  app.component('FplSubtitle', FplSubtitle);
  app.component('MarkedDiv', MarkedDiv);
});
