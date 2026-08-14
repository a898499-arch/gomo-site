// Characters 兩列、Characters Reference、Shot：等你把真的照片/角色圖丟進
// public/work/wanderbuddy/ 之後再實作（含 Characters 的無限漂移 CSS
// keyframes）。這裡先留一個视觉上跟 Mock up 的最終灰底佔位「明顯不同」的
// 提示框，避免混淆成「這就是最終設計」。
export default function AssetPending({ label, height = 300 }) {
  return (
    <section className="wb-section">
      <div className="wb-section-inner">
        <div
          style={{
            height,
            borderRadius: 20,
            border: '1px dashed #C9C9CE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9A9AA0',
            fontSize: 14,
          }}
        >
          {label}（等待你提供的圖檔）
        </div>
      </div>
    </section>
  );
}
