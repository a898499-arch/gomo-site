'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';

const SWATCHES = [
  { name: 'Food/ Red', hex: '#FF0005' },
  { name: 'Coffee/ Orange', hex: '#FF9E00' },
  { name: 'Film/ Yellow', hex: '#FBD500' },
  { name: 'Outdoor/ Green', hex: '#87FA89' },
  { name: 'Market/ Blue', hex: '#00DDF9' },
  { name: 'Music/ Indigo', hex: '#003AFF' },
  { name: 'Exhibition/ Pink', hex: '#FF7BFF' },
  { name: 'Workshop/ Brown', hex: '#ECE0D1' },
];

export default function ColorPalette() {
  const ref = useStandardEntrance('.wb-color-swatch');

  return (
    <section className="wb-section">
      <div className="wb-section-inner">
        <h2 className="wb-color-eyebrow">Color</h2>
        <div className="wb-color-grid" ref={ref}>
          {SWATCHES.map((swatch) => (
            <div
              className="wb-color-swatch"
              style={{ background: swatch.hex }}
              key={swatch.hex}
            >
              <p className="wb-color-swatch-name">{swatch.name}</p>
              <p className="wb-color-swatch-hex">{swatch.hex}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
