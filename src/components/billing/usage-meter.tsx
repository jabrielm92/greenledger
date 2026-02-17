import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
}

export function UsageMeter({
  label,
  current,
  limit,
  unit = "",
}: UsageMeterProps) {
  const isUnlimited = !isFinite(limit);
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">
            {current.toLocaleString()}
            {unit && <span className="text-sm font-normal text-slate-400"> {unit}</span>}
          </span>
          <span className="text-sm text-slate-500">
            {isUnlimited ? "Unlimited" : `of ${limit.toLocaleString()}`}
          </span>
        </div>
        {!isUnlimited && (
          <div className="mt-2">
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  isAtLimit
                    ? "bg-red-500"
                    : isNearLimit
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {isAtLimit && (
              <p className="mt-1 text-xs text-red-600">
                Limit reached. Upgrade to continue.
              </p>
            )}
            {isNearLimit && !isAtLimit && (
              <p className="mt-1 text-xs text-amber-600">
                Approaching limit ({percentage.toFixed(0)}% used)
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
