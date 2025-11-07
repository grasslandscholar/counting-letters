import { Card, CardBody } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface StatsCardProps {
  titleKey: string;
  value: number;
}

export const StatsCard = ({ titleKey, value }: StatsCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className="text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardBody className="py-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t(titleKey)}
        </p>
        <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          {value.toLocaleString()}
        </p>
      </CardBody>
    </Card>
  );
};
