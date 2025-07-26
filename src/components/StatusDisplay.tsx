"use client";

import React, { useState, useEffect } from "react";
import { statusApi, PublicStatus } from "@/lib/api/services/status";
import { STATUS_SERVICE } from "@/constants";
import { StatusService } from "@/lib/services/StatusService";

interface StatusDisplayProps {
  className?: string;
  showIndicator?: boolean;
  compact?: boolean;
}

const StatusStyleMapper = {
  getStyleByCategory(category: "busy" | "away" | "online"): string {
    switch (category) {
      case "busy":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50";
      case "away":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50";
      default:
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50";
    }
  },
  getIndicatorColor(category: "busy" | "away" | "online"): string {
    switch (category) {
      case "busy":
        return "bg-red-400";
      case "away":
        return "bg-yellow-400";
      default:
        return "bg-green-400";
    }
  },
};

const LoadingSkeleton = ({ className }: { className: string }) => (
  <div
    className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm ${className}`}
  >
    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
  </div>
);

const StatusContent = ({
  status,
  showIndicator,
  compact,
  className,
}: {
  status: PublicStatus;
  showIndicator: boolean;
  compact: boolean;
  className: string;
}) => {
  const predefinedStatus = StatusService.findPredefinedStatus(status.emoji);
  const categoryStyle = predefinedStatus
    ? StatusService.getStatusStyleCategory(predefinedStatus.id)
    : "online";
  const statusStyle = StatusStyleMapper.getStyleByCategory(categoryStyle);
  const indicatorColor = StatusStyleMapper.getIndicatorColor(categoryStyle);

  return (
    <div
      className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full ${statusStyle} backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border ${className}`}
    >
      {showIndicator && (
        <div className={`relative`}>
          <div
            className={`w-2.5 h-2.5 ${indicatorColor} rounded-full animate-pulse`}
          ></div>
          <div
            className={`absolute inset-0 w-2.5 h-2.5 ${indicatorColor} rounded-full animate-ping opacity-75`}
          ></div>
        </div>
      )}

      <span className="text-lg leading-none">{status.emoji}</span>

      {!compact && status.message && (
        <span
          className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-32"
          title={status.message}
        >
          {status.message}
        </span>
      )}

      {!compact && (
        <div
          className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400"
          title={`Last updated: ${StatusService.formatIndianTime(
            status.lastUpdated
          )} IST`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="truncate">
            {StatusService.formatTimeAgo(status.lastUpdated)}
          </span>
        </div>
      )}
    </div>
  );
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  className = "",
  showIndicator = true,
  compact = false,
}) => {
  const [status, setStatus] = useState<PublicStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const currentStatus = await statusApi.getCurrentStatus();
        setStatus(currentStatus);
      } catch {
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, STATUS_SERVICE.REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSkeleton className={className} />;
  }

  if (!status || !status.isActive) {
    return null;
  }

  return (
    <StatusContent
      status={status}
      showIndicator={showIndicator}
      compact={compact}
      className={className}
    />
  );
};

export default StatusDisplay;
