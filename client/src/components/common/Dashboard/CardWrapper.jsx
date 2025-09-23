import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import clsx from "clsx";

export default function CardWrapper({
  title,
  children,
  headerRight,
  borderColor,
  className,
}) {
  return (
    <Card
      className={clsx(
        "rounded-3xl shadow-md p-4 md:p-6",
        "bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700",
        "transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] hover:ring-1 hover:ring-neutral-300 dark:hover:ring-neutral-700",
        borderColor && `border-${borderColor}`,
        className
      )}
    >
      {(title || headerRight) && (
        <CardHeader className="flex flex-col items-center justify-center pb-4">
          {title && (
            <CardTitle className="text-lg md:text-xl font-semibold tracking-tight dark:text-neutral-50 text-center">
              {title}
            </CardTitle>
          )}
          {headerRight && <div className="mt-2">{headerRight}</div>}
        </CardHeader>
      )}
      <CardContent className="text-neutral-700 dark:text-neutral-300">
        {children}
      </CardContent>
    </Card>
  );
}
