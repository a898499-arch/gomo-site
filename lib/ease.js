// 全站共用主曲線 cubic-bezier(0.22, 1, 0.36, 1) — 從 prototypes/*.html 逐字搬過來，
// 讓 GSAP 的 `ease` 可以直接吃一個 (progress: number) => number 的函式，不需要額外掛 CustomEase 外掛。
export function makeBezierEase(x1, y1, x2, y2) {
  function A(a1, a2) { return 1.0 - 3.0 * a2 + 3.0 * a1; }
  function B(a1, a2) { return 3.0 * a2 - 6.0 * a1; }
  function C(a1) { return 3.0 * a1; }
  function calcBezier(t, a1, a2) { return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t; }
  function getSlope(t, a1, a2) { return 3.0 * A(a1, a2) * t * t + 2.0 * B(a1, a2) * t + C(a1); }
  function getTForX(x) {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const slope = getSlope(t, x1, x2);
      if (slope === 0) return t;
      const xEst = calcBezier(t, x1, x2) - x;
      t -= xEst / slope;
    }
    return t;
  }
  return function (x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return calcBezier(getTForX(x), y1, y2);
  };
}

export const mainEase = makeBezierEase(0.22, 1, 0.36, 1);
