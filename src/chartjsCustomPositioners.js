import { Tooltip } from 'chart.js';

Tooltip.positioners.custom = function (elements, eventPosition) {
  const pos = Tooltip.positioners.average(elements, eventPosition);
  if (pos) {
    pos.y -= 40;
  }
  return pos;
}; 