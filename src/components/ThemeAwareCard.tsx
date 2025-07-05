import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";
import { cn } from "@/lib/utils";

interface ThemeAwareCardProps {
  title?: string;
  headerChildren?: React.ReactNode;
  children: React.ReactNode;
  cardClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  className?: string;
}

const ThemeAwareCard: React.FC<ThemeAwareCardProps> = ({
  title,
  headerChildren,
  children,
  cardClassName,
  headerClassName,
  bodyClassName,
  className,
}) => {
  return (
    <Card
      className={cn(
        "bg-content1 border-1 shadow-sm rounded-xl p-6 md:p-8 border-divider",
        cardClassName,
        className
      )}
    >
      {(title || headerChildren) && (
        <CardHeader className={cn("border-b pb-3 mb-6", headerClassName)}>
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {headerChildren}
        </CardHeader>
      )}
      <CardBody className={cn("pt-0 px-0 pb-0", bodyClassName)}>
        {children}
      </CardBody>
    </Card>
  );
};

export default ThemeAwareCard;