import { Card, CardBody, Divider, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { NetworkMonitor } from "./components/NetworkMonitor";
import { StatsCard } from "./components/StatsCard";
import { ZhStats } from "./components/ZhStats";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  countCharsWithSpaces,
  countCharsWithoutSpaces,
  countWords,
  countThaiWords,
  countLines,
} from "./utils/count";
import { FooterInfo } from "./components/FooterInfo";

/* =========================
   🌍 Language helpers
========================= */
const SUPPORTED_LANGS = ["ko", "en", "zh", "ja", "th"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

function getLangFromPath(): Lang | null {
  const seg = window.location.pathname.split("/")[1];
  return (SUPPORTED_LANGS as readonly string[]).includes(seg)
    ? (seg as Lang)
    : null;
}

function App() {
  const [text, setText] = useState("");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t, i18n } = useTranslation();

  /* =========================
     ✅ 1) URL 기반 초기 언어
  ========================= */
  const [selectedLanguage, setSelectedLanguage] = useState<Lang>(
    () => getLangFromPath() ?? "ko"
  );

  /* =========================
     ✅ 2) i18n 언어 동기화
  ========================= */
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  /* =========================
     🌐 HTML lang 속성 유지
     브라우저가 올바른 시스템 폰트를 고르도록
  ========================= */
  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  /* =========================
     ✅ 3) URL(/en 등)이 있으면
        드롭다운도 거기에 맞추기
  ========================= */
  useEffect(() => {
    const pathLang = getLangFromPath();
    if (pathLang && pathLang !== selectedLanguage) {
      setSelectedLanguage(pathLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ ZH 전용: 고급 통계 토글
  const [showAdvancedZh, setShowAdvancedZh] = useState(false);
  const isZh = selectedLanguage === "zh";

  // ✅ 언어가 zh가 아니면 고급 토글 닫기
  useEffect(() => {
    if (!isZh) setShowAdvancedZh(false);
  }, [isZh]);

  return (
    <>
      <Controls
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="pt-16 flex flex-col md:flex-row items-start justify-center gap-6 px-4">
        <div className="flex-1 max-w-4xl">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardBody className="p-8">
              <Header />

              <div className="mb-8 relative">
                <Textarea
                  label={t("textareaLabel")}
                  placeholder={t("textareaPlaceholder")}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  minRows={8}
                  maxRows={16}
                  style={{ fontSize: "1rem" }}
                  variant="bordered"
                  classNames={{
                    input: "pr-10",
                  }}
                />
                {text && (
                  <button
                    type="button"
                    onClick={() => setText("")}
                    className="absolute top-3 right-3 inline-flex items-center justify-center w-8 h-8 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                    aria-label={t("clearButtonLabel")}
                    title={t("clearButtonLabel")}
                  >
                    ×
                  </button>
                )}
              </div>

              {!isZh ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatsCard
                    titleKey="charWithSpaces"
                    value={countCharsWithSpaces(text)}
                  />
                  <StatsCard
                    titleKey="charWithoutSpaces"
                    value={countCharsWithoutSpaces(text)}
                  />
                  {selectedLanguage === "ja" ? (
                    <StatsCard
                      titleKey="lineCount"
                      value={countLines(text)}
                    />
                  ) : (
                    <StatsCard
                      titleKey="wordCount"
                      value={
                        selectedLanguage === "th"
                          ? countThaiWords(text)
                          : countWords(text)
                      }
                    />
                  )}
                </div>
              ) : (
                <ZhStats
                  text={text}
                  showAdvanced={showAdvancedZh}
                  onToggleAdvanced={() => setShowAdvancedZh((v) => !v)}
                />
              )}

              <Divider className="my-6" />

              <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
                {t("footer")}
              </div>

              <FooterInfo />
            </CardBody>
          </Card>
        </div>

        <div className="w-full md:w-80 mb-8">
          <NetworkMonitor />
        </div>
      </div>
    </>
  );
}

export default App;
