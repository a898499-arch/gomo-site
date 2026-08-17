// 這輪只做骨架，5 個動畫區塊（Process Animation / Function 1 / Function 3 /
// Function 4 / All UI Animation）先用灰色佔位塊擋位，尺寸照 Figma 該區塊
// 的實際尺寸（w/h 是 Figma node 的參考寬高，用來算 aspect-ratio，讓佔位
// 塊隨容器寬度等比縮放）。Hero 沒有專屬 Figma node（純粹是 Nav 底到
// Logo & Overview 頂的空隙），呼叫方直接傳 height（純數字 px）取代 w/h。
export default function AnimationPlaceholder({ label, w, h, height }) {
  const style = height != null
    ? { height: `${height}px` }
    : { aspectRatio: `${w} / ${h}` };

  return (
    <div className="ss-placeholder" style={style}>
      <p className="ss-placeholder-label">{label}</p>
    </div>
  );
}
