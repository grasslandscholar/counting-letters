// 파일 설명 키 매핑 (특정 파일들)
export const fileDescriptionKeys: Record<string, string> = {
  "main.tsx": "fileDesc_main_tsx",
  "App.tsx": "fileDesc_App_tsx",
  "NetworkMonitor.tsx": "fileDesc_NetworkMonitor_tsx",
  "react.js": "fileDesc_react_js",
  "react-dom_client.js": "fileDesc_react_dom_client_js",
  "react_jsx-dev-runtime.js": "fileDesc_react_jsx_dev_runtime_js",
  "@heroui_react.js": "fileDesc_heroui_react_js",
  "lucide-react.js": "fileDesc_lucide_react_js",
  "i18next.js": "fileDesc_i18next_js",
  "react-i18next.js": "fileDesc_react_i18next_js",
  "index.css": "fileDesc_index_css",
  "calculator.svg": "fileDesc_calculator_svg",
  "en.json": "fileDesc_en_json",
  "ko.json": "fileDesc_ko_json",
  "zh.json": "fileDesc_zh_json",
  "ja.json": "fileDesc_ja_json",
  "th.json": "fileDesc_th_json",
  "i18n.ts": "fileDesc_i18n_ts",
  "Controls.tsx": "fileDesc_Controls_tsx",
  "ZhStats.tsx": "fileDesc_ZhStats_tsx",
  "FooterInfo.tsx": "fileDesc_FooterInfo_tsx",
  "Header.tsx": "fileDesc_Header_tsx",
  "StatsCard.tsx": "fileDesc_StatsCard_tsx",
  "count.ts": "fileDesc_count_ts",
  "useDarkMode.ts": "fileDesc_useDarkMode_ts",
  "useAutoScroll.ts": "fileDesc_useAutoScroll_ts",
  "hero.ts": "fileDesc_hero_ts",
  "fileDescriptions.ts": "fileDesc_fileDescriptions_ts",
  "env.mjs": "fileDesc_env_mjs",
  "@react-refresh": "fileDesc_react_refresh",
  client: "fileDesc_client",
  posts: "fileDesc_posts",
  "1": "fileDesc_1",
};

// 정규식 패턴 매핑 (패턴 우선순위대로)
export const patternDescriptions: Array<{ pattern: RegExp; key: string }> = [
  // Cloudflare Analytics beacon hash
  // - vcd... : Cloudflare Analytics script
  // - v8c... : Cloudflare Analytics/RUM beacon script
  { pattern: /^v(?:cd|8c)[a-f0-9]{20,}$/, key: "fileDesc_cloudflare_analytics" },

  // Vite / Rollup src chunk
  { pattern: /^src-.*\.js$/, key: "fileDesc_vite_chunk_js" },

  { pattern: /^chunk-.*\.js$/, key: "fileDesc_chunk_js" },
  { pattern: /^dist-.*\.js$/, key: "fileDesc_dist_js" },
  { pattern: /^index-.*\.js$/, key: "fileDesc_index_js" },
  { pattern: /^index-.*\.css$/, key: "fileDesc_index_css" },
  { pattern: /^es-.*\.js$/, key: "fileDesc_es_js" },
  { pattern: /^features-.*\.js$/, key: "fileDesc_features_js" },
];

// ✅ 파일 설명 가져오기 함수 (단 하나)
export const getFileDescription = (
  fileName: string,
  t: (key: string) => string
): string => {
  const clean = fileName.split("?")[0];

  // ✅ Cloudflare RUM (파일 아님, 경로 기반 엔드포인트)
  if (clean.includes("/cdn-cgi/rum")) {
    return t("fileDesc_cloudflare_rum");
  }

  const baseName = clean.split("/").pop() || clean;

  // 정규식 패턴 우선
  for (const { pattern, key } of patternDescriptions) {
    if (pattern.test(baseName)) {
      return t(key);
    }
  }

  // 고정 파일명
  const mappedKey = fileDescriptionKeys[baseName];
  if (mappedKey) {
    return t(mappedKey);
  }

  return t("fileDesc_other");
};
