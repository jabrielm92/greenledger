import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GeneratedSection } from "@/types";

interface ReportPreviewProps {
  sections: GeneratedSection[];
  className?: string;
}

export function ReportPreview({ sections, className }: ReportPreviewProps) {
  if (sections.length === 0) {
    return (
      <div className={`rounded-md border p-8 text-center text-sm text-slate-500 ${className || ""}`}>
        No report sections to preview.
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {sections.map((section) => (
        <Card key={section.code} id={`section-${section.code}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">
                {section.code} — {section.title}
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 text-[10px]"
              >
                AI Generated
              </Badge>
              {section.confidence > 0 && (
                <span className="text-[10px] text-slate-400">
                  {(section.confidence * 100).toFixed(0)}% confidence
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-slate-700">
              {section.content.split("\n").map((line, i) => {
                if (line.startsWith("### "))
                  return (
                    <h4 key={i} className="mt-3 text-sm font-semibold">
                      {line.slice(4)}
                    </h4>
                  );
                if (line.startsWith("## "))
                  return (
                    <h3 key={i} className="mt-4 text-base font-semibold">
                      {line.slice(3)}
                    </h3>
                  );
                if (line.startsWith("- "))
                  return (
                    <li key={i} className="ml-4 text-sm">
                      {line.slice(2)}
                    </li>
                  );
                if (line.trim() === "") return <br key={i} />;
                return (
                  <p key={i} className="text-sm">
                    {line}
                  </p>
                );
              })}
            </div>
            {section.dataPointsUsed.length > 0 && (
              <p className="mt-3 text-[10px] text-slate-400">
                Data points: {section.dataPointsUsed.join(", ")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
