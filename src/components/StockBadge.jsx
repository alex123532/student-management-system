import { LOW_STOCK_THRESHOLD } from '../utils/constants';

export function stockLevel(quantity) {
  if (quantity === 0) return 'out';
  if (quantity < LOW_STOCK_THRESHOLD) return 'low';
  return 'ok';
}

const LABELS = { out: 'Out of stock', low: 'Low stock', ok: 'In stock' };

export default function StockBadge({ quantity }) {
  const level = stockLevel(quantity);
  return <span className={`badge badge--${level}`}>{LABELS[level]}</span>;
}
