# GOMO 作品集網站

## 專案
Maida Hu 的個人作品集。設計已定稿，動效規格在 specs/。
規格書是唯一真實來源——不要自行「改良」設計或動效。

## 技術棧
GSAP（所有動畫 + ScrollTrigger）· Lenis（平滑捲動）· inline SVG
階段 2：單一 HTML 檔 + CDN
階段 3 之後：React + Next.js App Router
禁止加入 Framer Motion——會與 GSAP 搶 RAF。
要引入任何規格外的套件，先問我。

## 動效硬規則
- 只動 transform / opacity / clip-path
- 絕不動 width / height / top / left / margin
- 插畫一律 inline SVG，不用 <img>
- will-change 只在動畫執行期間掛上，結束移除
- 目標 60fps；轉場階段只能有 composite，不能有 layout 或 paint
- 每段動效都要實作 @media (prefers-reduced-motion: reduce)

## 工作方式
- Limit code changes to the minimum. 只改我指定的部分。
- 動手前先說明你要改哪些檔案、為什麼。
- 完成後對照該段規格的 Acceptance Criteria 自我檢查，逐條回報通過與否。

## 版本控制
- 每完成一個可以跑、通過驗收的階段，主動提醒我要不要 commit，並附上建議的 commit 訊息。
- 不要自己擅自 commit——先問過我確認再存。

## 設計還原
- 任何涉及顏色、字級、間距、版面位置的實作或修正，一律先用 Figma MCP 讀取對應區塊的精確數值，不可只憑截圖或文字描述用猜的。
- 完成後列出每個數值的來源（Figma 讀到的實際值 vs 你採用的值），讓我可以核對。
- 若某個元素在 Figma 稿裡找不到對應資訊（例如 hover 狀態這種原型限定的東西），要明確告訴我「Figma 沒有這個資訊，以下是我的假設」，不要沉默地用猜的。
- 所有截圖驗證一律同時測 **1155px 和 1440px** 兩種寬度，兩個都要過。1155px 是我實際在看網站的視窗寬度，優先級跟 1440px（Figma 參考寬度）一樣高，不可只測 1440px 就回報完成。
- 讀 Figma 一律優先用 `get_design_context`，不要只用 `get_metadata`。`get_metadata` 只給座標，會逼你自己發明版面；`get_design_context` 會給參考程式碼跟截圖，那才是設計轉程式碼該用的工具。只有在需要快速掃描結構（例如列一份區塊清單）時才用 `get_metadata`。
- 嚴禁自行簡化 Figma 的版面。不規則排列、磚牆式拼貼、各不相同的尺寸——這些都是刻意的設計，不是可以「整理成格狀」的雜訊。如果某處技術上難以還原，停下來單獨問我，不要在長報告的中段輕描淡寫地提一句就自行決定簡化。簡化必須是我明確同意的，不是你通知我的。
- 每個區塊完成後，用 Chrome DevTools MCP 截圖，跟 Figma 該區塊的截圖做疊圖比對，明確回報：哪些元素的位置/尺寸差超過 8px。不要只說「還原度很高」，要給具體數字。
