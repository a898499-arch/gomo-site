'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import AppIcon from './AppIcon';

export default function LogoOverview() {
  const ref = useStandardEntrance('.wb-entrance-item');

  return (
    <section className="wb-section" ref={ref}>
      <div className="wb-overview-inner">
        <div className="wb-entrance-item">
          <AppIcon />
        </div>

        <div className="wb-overview-text">
          <h1 className="wb-overview-title wb-entrance-item">Wander Buddy</h1>

          <p className="wb-overview-tagline wb-entrance-item">
            Turning a three-minute sign-up into a 30-second first impression.
          </p>

          <p className="wb-overview-body wb-entrance-item">
            WanderBuddy connects newcomers, international students, and remote workers with
            companions for exploring the city. Most apps lose users at sign-up, too few options,
            too many fields. I designed a flow with three entry points and only the essentials:
            email, name, and interests, just enough to match people with the right activities from
            day one.
          </p>
        </div>
      </div>

      {/* 分隔線刻意脫離 .wb-overview-inner 自己的 140px 內距，改用跟導覽列
          同一個 .page-container（同一個 --page-gutter 變數），左右緣對齊
          導覽列 logo 左緣／About Me 右緣，兩邊改動會自動同步。 */}
      <div className="wb-overview-divider-row page-container wb-entrance-item">
        <div className="wb-overview-divider" />
      </div>

      <div className="wb-overview-inner wb-overview-inner--meta">
        <div className="wb-overview-meta wb-entrance-item">
          <div className="wb-overview-meta-item">
            <span className="wb-overview-meta-label">Type</span>
            <span className="wb-overview-meta-value">UI Challenge</span>
          </div>
          <div className="wb-overview-meta-item">
            <span className="wb-overview-meta-label">Category</span>
            <span className="wb-overview-meta-value">
              UI/UX Design
              <br />
              AI assist
            </span>
          </div>
          <div className="wb-overview-meta-item">
            <span className="wb-overview-meta-label">Tool</span>
            <span className="wb-overview-meta-value">
              Figma
              <br />
              Claude
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
