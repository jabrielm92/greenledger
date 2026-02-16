import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEmissions } from "@/lib/utils";
import type { CalculationResult } from "@/types";

interface CalculationDetailProps {
  result: CalculationResult;
  className?: string;
}

export function CalculationDetail({
  result,
  className,
}: CalculationDetailProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-500">
          Calculation Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg bg-emerald-50 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">
            {formatEmissions(result.co2e)}
          </p>
          <p className="text-xs text-emerald-600">Total CO2 equivalent</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-medium">
              {result.co2.toFixed(2)} kg
            </p>
            <p className="text-xs text-slate-500">CO2</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-medium">
              {result.ch4.toFixed(4)} kg
            </p>
            <p className="text-xs text-slate-500">CH4 (CO2e)</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-sm font-medium">
              {result.n2o.toFixed(4)} kg
            </p>
            <p className="text-xs text-slate-500">N2O (CO2e)</p>
          </div>
        </div>

        <div className="space-y-1 text-xs text-slate-500">
          <p>
            <strong>Factor:</strong> {result.emissionFactor}{" "}
            ({result.emissionFactorSource})
          </p>
          <p>
            <strong>Method:</strong> {result.calculationMethod}
          </p>
        </div>

        <details className="text-xs">
          <summary className="cursor-pointer text-slate-400 hover:text-slate-600">
            Full methodology
          </summary>
          <pre className="mt-2 whitespace-pre-wrap rounded bg-slate-50 p-2 text-slate-600">
            {result.methodology}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
