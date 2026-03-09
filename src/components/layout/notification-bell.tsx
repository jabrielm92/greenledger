"use client";

import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/use-notifications";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, string> = {
  EXTRACTION_COMPLETE: "📄",
  EXTRACTION_FAILED: "❌",
  EMISSION_AUTO_CREATED: "🌿",
  SUPPLIER_AUTO_CREATED: "🏢",
  REPORT_STALE: "⚠️",
  COMPLIANCE_MILESTONE: "🎯",
};

export function NotificationBell() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } =
    useNotifications();
  const router = useRouter();

  const handleClick = async (notification: (typeof notifications)[0]) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      router.push(`/dashboard${notification.link}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between px-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-slate-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                markAllAsRead();
              }}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="px-4 py-6 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-slate-400">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex cursor-pointer flex-col items-start gap-1 px-3 py-2.5",
                !notification.isRead && "bg-emerald-50/50"
              )}
              onClick={() => handleClick(notification)}
            >
              <div className="flex w-full items-start gap-2">
                <span className="mt-0.5 text-sm">
                  {TYPE_ICONS[notification.type] || "🔔"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {notification.link && (
                      <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    <Check className="h-3 w-3 text-slate-400" />
                  </Button>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
