/** @type {import('next').NextConfig} */
const nextConfig = {
  // 專案已經有自己的 CLAUDE.md（GOMO 專案規則），關掉 Next.js 自動在裡面
  // 插入/改寫 agent 說明區塊的行為，避免每次 `next dev` 都把它弄髒。
  agentRules: false,
};

export default nextConfig;
