"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Eye } from "lucide-react";

interface SectionEditorProps {
  code: string;
  title: string;
  content: string;
  isAIGenerated: boolean;
  confidence: number;
  onEdit: (content: string) => void;
}

export function SectionEditor({
  code,
  title,
  content,
  isAIGenerated,
  confidence,
  onEdit,
}: SectionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onEdit(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <Card id={`section-${code}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">
              {code} — {title}
            </CardTitle>
            {isAIGenerated && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 text-[10px]"
              >
                AI Generated
              </Badge>
            )}
            {!isAIGenerated && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 text-[10px]"
              >
                Edited
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Eye className="mr-1 h-3 w-3" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="mr-1 h-3 w-3" />
                Edit
              </>
            )}
          </Button>
        </div>
        {confidence > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">
              {(confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={12}
              className="font-mono text-xs"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-slate-700">
            {content.split("\n").map((line, i) => {
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
        )}
      </CardContent>
    </Card>
  );
}
