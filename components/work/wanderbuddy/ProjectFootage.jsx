'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import AppIcon from './AppIcon';

export default function ProjectFootage() {
  const ref = useStandardEntrance('.wb-entrance-item');

  return (
    <section className="wb-section wb-footage" ref={ref}>
      <div className="wb-section-inner">
        <div className="wb-footage-icon wb-entrance-item">
          <AppIcon />
        </div>
        <h2 className="wb-footage-title wb-entrance-item">Wander Buddy</h2>
        <p className="wb-footage-tagline wb-entrance-item">
          Turning a three-minute sign-up into a 30-second first impression.
        </p>
      </div>
    </section>
  );
}
