import { Card, CardBody, Divider, Textarea } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controls } from "./components/Controls";
import { Header } from "./components/Header";
import { StatsCard } from "./components/StatsCard";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  countCharsWithSpaces,
  countCharsWithoutSpaces,
  countWords,
} from "./utils/count";

function App() {
  const [text, setText] = useState("");
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [selectedLanguage, setSelectedLanguage] = useState("ko");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 flex items-center justify-center relative">
      <Controls
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="w-full max-w-4xl mt-16 md:mt-0">
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardBody className="p-8">
            <Header />

            <div className="mb-8">
              <Textarea
                label={t("textareaLabel")}
                placeholder={t("textareaPlaceholder")}
                value={text}
                onChange={(e) => setText(e.target.value)}
                minRows={8}
                className="text-lg"
                variant="bordered"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                titleKey="charWithSpaces"
                value={countCharsWithSpaces(text)}
              />
              <StatsCard
                titleKey="charWithoutSpaces"
                value={countCharsWithoutSpaces(text)}
              />
              <StatsCard titleKey="wordCount" value={countWords(text)} />
            </div>

            <Divider className="my-6" />

            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              {t("footer")}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default App;
