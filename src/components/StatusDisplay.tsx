'use client';

import React, { useState, useEffect } from 'react';
import { statusApi, PublicStatus } from '@/lib/api/services/status';
import { STATUS_STYLES, STATUS_SERVICE } from '@/constants';
import { StatusService } from '@/lib/services/StatusService';

interface StatusDisplayProps {
  className?: string;
  showIndicator?: boolean;
  compact?: boolean;
}

const StatusStyleMapper = {
  getStyleByCategory(category: 'busy' | 'away' | 'online'): string {
    switch (category) {
      case 'busy': return STATUS_STYLES.BUSY;
      case 'away': return STATUS_STYLES.AWAY;
      default: return STATUS_STYLES.ONLINE;
    }
  },
};

const LoadingSkeleton = ({ className }: { className: string }) => (
  <div className={`${STATUS_STYLES.CONTAINER} bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-700/50 ${className} max-w-sm mx-auto relative`}>
    <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse shadow-md border-2 border-white dark:border-gray-800"></div>
    
    <div className="flex items-center space-x-3 w-full">
      <div className={`${STATUS_STYLES.LOADING_SKELETON} flex-shrink-0`}></div>
      <div className="flex-1 min-w-0">
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
        <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const StatusContent = ({ 
  status, 
  showIndicator, 
  compact, 
  className 
}: {
  status: PublicStatus;
  showIndicator: boolean;
  compact: boolean;
  className: string;
}) => {
  const predefinedStatus = StatusService.findPredefinedStatus(status.emoji);
  const categoryStyle = predefinedStatus 
    ? StatusService.getStatusStyleCategory(predefinedStatus.id)
    : 'online';
  const statusStyle = StatusStyleMapper.getStyleByCategory(categoryStyle);

  return (
    <div className={`${STATUS_STYLES.CONTAINER} ${statusStyle} ${className} max-w-sm mx-auto relative`}>
      {showIndicator && (
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-md border-2 border-white dark:border-gray-800"></div>
      )}
      
      <div className="flex items-center space-x-3 w-full">
        <div className="flex-shrink-0">
          <span className={`${STATUS_STYLES.EMOJI}`}>{status.emoji}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          {!compact && status.message && (
            <div className="font-medium text-sm sm:text-base mb-1 truncate" 
                 style={{color: '#1f2937'}}
                 title={status.message}>
              {status.message}
            </div>
          )}
          
          {!compact && (
            <div className="text-xs flex items-center space-x-1" 
                 style={{color: '#4b5563'}}
                 title={`Last updated: ${StatusService.formatIndianTime(status.lastUpdated)} IST`}>
              <svg className="w-3 h-3 flex-shrink-0" style={{color: '#4b5563'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{StatusService.formatTimeAgo(status.lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusDisplay: React.FC<StatusDisplayProps> = ({ 
  className = '', 
  showIndicator = true,
  compact = false 
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