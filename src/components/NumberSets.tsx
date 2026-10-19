import { useState } from 'react';
import { MathText, Tex } from './MathText';

// The real numbers as nested boxes: N ⊂ W ⊂ Z ⊂ Q ⊂ R, with the irrationals beside Q.
type SetId = 'N' | 'W' | 'Z' | 'Q' | 'I';

interface Item { tex: string; set: SetId; note: string }

const items: Item[] = [
  { tex: '7', set: 'N', note: 'A counting number.' },
  { tex: '\\sqrt{9}', set: 'N', note: '$\\sqrt{9} = 3$, a counting number.' },
  { tex: '0', set: 'W', note: 'Zero is whole, but counting starts at 1.' },
  { tex: '-4', set: 'Z', note: 'A negative integer.' },
  { tex: '-\\dfrac{12}{3}', set: 'Z', note: '$-\\frac{12}{3} = -4$, an integer.' },
  { tex: '\\dfrac{2}{3}', set: 'Q', note: 'A ratio of two integers.' },
  { tex: '-0.25', set: 'Q', note: 'Terminates: $-0.25 = -\\frac{1}{4}$.' },
  { tex: '0.\\overline{3}', set: 'Q', note: 'Repeats: $0.333\\ldots = \\frac{1}{3}$.' },
  { tex: '\\sqrt{2}', set: 'I', note: '$1.41421356\\ldots$ never ends, never repeats.' },
  { tex: '\\pi', set: 'I', note: '$3.14159265\\ldots$ never ends, never repeats.' },
  { tex: '-\\sqrt{5}', set: 'I', note: '$5$ is not a perfect square.' },
];

const memberships: Record<SetId, string[]> = {
  N: ['Natural', 'Whole', 'Integer', 'Rational', 'Real'],
  W: ['Whole', 'Integer', 'Rational', 'Real'],
  Z: ['Integer', 'Rational', 'Real'],
  Q: ['Rational', 'Real'],
  I: ['Irrational', 'Real'],
};
const ALL = ['Natural', 'Whole', 'Integer', 'Rational', 'Irrational', 'Real'];

// Box geometry (viewBox 0 0 600 330)
const boxes = [
  { id: 'R', name: 'Real', label: 'Real numbers', x: 6, y: 6, w: 588, h: 318, cls: 'ns-r' },
  { id: 'Q', name: 'Rational', label: 'Rational', x: 20, y: 34, w: 400, h: 278, cls: 'ns-q' },
  { id: 'Z', name: 'Integer', label: 'Integers', x: 34, y: 62, w: 270, h: 238, cls: 'ns-z' },
  { id: 'W', name: 'Whole', label: 'Whole', x: 48, y: 90, w: 160, h: 198, cls: 'ns-w' },
  { id: 'N', name: 'Natural', label: 'Natural', x: 62, y: 118, w: 132, h: 158, cls: 'ns-n' },
  { id: 'I', name: 'Irrational', label: 'Irrational', x: 432, y: 34, w: 150, h: 278, cls: 'ns-i' },
];
// Where a selected number is dropped, by its smallest set
const spots: Record<SetId, [number, number]> = { N: [128, 210], W: [128, 105], Z: [255, 180], Q: [362, 180], I: [507, 180] };

export default function NumberSets() {
  const [sel, setSel] = useState(5);
  const it = items[sel];
  const mem = new Set(memberships[it.set]);
  const [cx, cy] = spots[it.set];

  return (
    <div className="ns card">
      <div className="ns-chips" role="group" aria-label="Pick a number">
        {items.map((x, i) => (
          <button key={x.tex} className={`ns-chip ${i === sel ? 'on' : ''}`} onClick={() => setSel(i)} aria-pressed={i === sel}>
            <Tex>{x.tex}</Tex>
          </button>
        ))}
      </div>
      <div className="ns-body">
        <svg viewBox="0 0 600 330" className="ns-svg" role="img" aria-label={`The number belongs to: ${[...mem].join(', ')}`}>
          {boxes.map((b) => (
            <g key={b.id} className={`ns-box ${b.cls} ${mem.has(b.name) ? 'hit' : ''}`}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={16} />
              <text x={b.x + 12} y={b.y + 20}>{b.label}</text>
            </g>
          ))}
          <g style={{ transform: `translate(${cx}px, ${cy}px)`, transition: 'transform 0.45s cubic-bezier(.3,1.3,.5,1)' }}>
            <circle r={22} className="ns-dot" />
          </g>
        </svg>
        <div className="ns-info">
          <div className="ns-big"><Tex display>{it.tex}</Tex></div>
          <ul className="ns-list">
            {ALL.map((s) => (
              <li key={s} className={mem.has(s) ? 'yes' : 'no'}>
                <span aria-hidden>{mem.has(s) ? '✓' : '✗'}</span> {s}
              </li>
            ))}
          </ul>
          <MathText as="div" className="ns-note">{it.note}</MathText>
        </div>
      </div>
    </div>
  );
}
