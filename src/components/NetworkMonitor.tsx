import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface NetworkEntry {
  name: string;
  initiatorType: string;
  duration: number;
  transferSize: number;
  startTime: number;
}

export const NetworkMonitor = () => {
  const [entries, setEntries] = useState<NetworkEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState("server-to-client");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const networkEntries = list
        .getEntries()
        .filter(
          (entry) => entry.entryType === "resource"
        ) as PerformanceResourceTiming[];

      const formattedEntries: NetworkEntry[] = networkEntries.map((entry) => ({
        name: entry.name,
        initiatorType: entry.initiatorType,
        duration: Math.round(entry.duration),
        transferSize: entry.transferSize,
        startTime: Math.round(entry.startTime),
      }));

      setEntries((prev) => [...prev, ...formattedEntries]);
    });

    observer.observe({ entryTypes: ["resource"] });

    // 초기 로드된 리소스들도 가져오기
    const initialEntries = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    const initialFormatted: NetworkEntry[] = initialEntries.map((entry) => ({
      name: entry.name,
      initiatorType: entry.initiatorType,
      duration: Math.round(entry.duration),
      transferSize: entry.transferSize,
      startTime: Math.round(entry.startTime),
    }));
    setEntries(initialFormatted);

    return () => observer.disconnect();
  }, []);

  // 스크롤을 하단으로 자동 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries, selectedTab]);

  return (
    <Card className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t("networkMonitor")}
        </h3>
      </CardHeader>
      {entries.length === 0 ? (
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("noNetworkRequests")}
          </p>
        </CardBody>
      ) : (
        <>
          <CardBody className="pt-0">
            <Tabs
              aria-label="Network direction tabs"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
            >
              <Tab
                key="server-to-client"
                title={
                  <div className="flex items-center gap-2">{t("download")}</div>
                }
              >
                <div ref={scrollRef} className="overflow-y-auto max-h-96 mt-4">
                  <div className="space-y-2">
                    {entries.map((entry, index) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded"
                      >
                        <div
                          className="font-medium text-gray-900 dark:text-gray-100 truncate"
                          title={entry.name}
                        >
                          {entry.name.split("/").pop()}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs">
                          {t("duration")}: {entry.duration}ms | {t("size")}:{" "}
                          {entry.transferSize} bytes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab>
              <Tab
                key="client-to-server"
                title={
                  <div className="flex items-center gap-2">{t("upload")}</div>
                }
              >
                <div className="mt-4">
                  <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                    {t("noRequests")}
                  </p>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </>
      )}
    </Card>
  );
};
