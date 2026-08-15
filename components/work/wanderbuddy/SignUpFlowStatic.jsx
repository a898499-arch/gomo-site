'use client';

import { useStandardEntrance } from '@/lib/useStandardEntrance';
import {
  ShapeHouse,
  ShapeArrow,
  ShapeScallopFilled,
  ShapeScallopOutline,
  ShapePill,
} from './signUpFlowShapes';

// 座標全部取自 Figma node 491:232（1440×541 深色炭灰背景）。用 % 定位，
// 讓整段隨容器寬度等比縮放。連接線是簡化的直線示意（Figma 原始是彎折的
// bracket 路徑，這裡簡化成直線＋轉角，不逐點還原向量路徑，你已經同意這樣做）。
const FRAME_W = 1440;
const FRAME_H = 541;
const px = (v, total) => `${((v / total) * 100).toFixed(4)}%`;

const SHAPES = [
  { key: 'onboarding', Shape: ShapePill, x: 41, y: 250, w: 202.09, h: 51.33, label: 'Onboarding', color: '#303030', fontSize: 20 },
  { key: 'apple', Shape: ShapeScallopFilled, x: 327.8, y: 124, w: 197.99, h: 79.85, label: 'Sign in with Apple', color: '#303030', fontSize: 18 },
  { key: 'google', Shape: ShapeScallopFilled, x: 327.8, y: 229.92, w: 197.99, h: 79.85, label: 'Sign in with Google', color: '#303030', fontSize: 18 },
  { key: 'email', Shape: ShapeScallopFilled, x: 327.8, y: 337.47, w: 197.99, h: 79.85, label: 'Email Register', color: '#303030', fontSize: 18 },
  { key: 'verification', Shape: ShapeScallopOutline, x: 615, y: 329, w: 197.99, h: 93.85, label: 'Verification Code', color: '#FBD500', fontSize: 18 },
  { key: 'interest', Shape: ShapeArrow, x: 982, y: 228.29, w: 189.44, h: 83.4, label: 'Interest Page', color: '#303030', fontSize: 20 },
  { key: 'home', Shape: ShapeHouse, x: 1219.96, y: 198.14, w: 188.4, h: 112.03, label: 'Home Page', color: '#303030', fontSize: 20, textPad: '38%' },
];

const SYSTEM_BOXES = [
  { key: 'faceid', x: 615, y: 124, w: 198, h: 80, label: 'System: Face ID Auth' },
  { key: 'google-picker', x: 615, y: 232, w: 273, h: 76, label: 'System: Google account Picker' },
];

const H_LINES = [
  { x: 228.39, y: 274.73, w: 110.81 },
  { x: 525.59, y: 164.16, w: 89 },
  { x: 525.59, y: 270.16, w: 89 },
  { x: 525.59, y: 377.16, w: 89 },
  { x: 888, y: 270, w: 94 },
];

const V_LINES = [
  { x: 312, y: 165.14, h: 215.1 },
  { x: 865, y: 162.29, h: 214.28 },
];

const DOTS_Y = 264.95;
const DOTS_X = [1159.67, 1175.96, 1192.26, 1208.55];
const DOT_SIZE = 11.41;

export default function SignUpFlowStatic() {
  // 整個區塊一次出現，不分 stagger：不傳 itemsSelector，整個容器當一個單位。
  const ref = useStandardEntrance();

  return (
    <section className="wb-section" ref={ref}>
      <div className="wb-section-inner">
        <div
          className="wb-signup-diagram"
          style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
          aria-hidden="true"
        >
          <p className="wb-signup-title">Sign Up Flow</p>

          {H_LINES.map((l, i) => (
            <span
              key={`h${i}`}
              className="wb-signup-line-h"
              style={{ left: px(l.x, FRAME_W), top: px(l.y, FRAME_H), width: px(l.w, FRAME_W) }}
            />
          ))}
          {V_LINES.map((l, i) => (
            <span
              key={`v${i}`}
              className="wb-signup-line-v"
              style={{ left: px(l.x, FRAME_W), top: px(l.y, FRAME_H), height: px(l.h, FRAME_H) }}
            />
          ))}
          {DOTS_X.map((x, i) => (
            <span
              key={`d${i}`}
              className="wb-signup-dot"
              style={{
                left: px(x, FRAME_W),
                top: px(DOTS_Y, FRAME_H),
                width: px(DOT_SIZE, FRAME_W),
                height: px(DOT_SIZE, FRAME_H),
              }}
            />
          ))}

          {SYSTEM_BOXES.map((b) => (
            <div
              key={b.key}
              className="wb-signup-system-box"
              style={{
                left: px(b.x, FRAME_W),
                top: px(b.y, FRAME_H),
                width: px(b.w, FRAME_W),
                height: px(b.h, FRAME_H),
              }}
            >
              {b.label}
            </div>
          ))}

          {SHAPES.map(({ key, Shape, x, y, w, h, label, color, fontSize, textPad }) => (
            <div
              key={key}
              className="wb-signup-shape"
              style={{ left: px(x, FRAME_W), top: px(y, FRAME_H), width: px(w, FRAME_W), height: px(h, FRAME_H) }}
            >
              <Shape className="wb-signup-shape-svg" preserveAspectRatio="none" />
              <span
                className="wb-signup-shape-label"
                style={{ color, fontSize: `clamp(${fontSize * 0.6}px, ${(fontSize / FRAME_W) * 100}vw, ${fontSize}px)`, paddingTop: textPad }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* 完整流程文字給螢幕閱讀器；上面那一整組形狀對 AT 沒有意義，隱藏掉 */}
        <p className="visually-hidden">
          Sign up flow: Onboarding leads to three entry points — Sign in with Apple, Sign in with
          Google, or Email Register. Apple leads to System: Face ID Auth; Google leads to System:
          Google account Picker; Email Register leads to Verification Code. All three paths
          converge on the Interest Page, which leads to the Home Page.
        </p>
      </div>
    </section>
  );
}
