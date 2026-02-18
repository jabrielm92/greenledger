import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface AuditBadgeProps {
  label?: string;
  className?: string;
}

export function AuditBadge({ label = "Audit Trail", className }: AuditBadgeProps) {
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-normal ${className || ""}`}>
      <Shield className="h-3 w-3" />
      {label}
    </Badge>
  );
}
