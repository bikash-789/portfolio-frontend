'use client';

import React, { useState, useEffect } from 'react';
import { statusApi, UserStatus, CreateStatusRequest } from '@/lib/api/services/status';
import { STATUS_CONFIG, STATUS_STYLES, ADMIN_STYLES, STATUS_SERVICE } from '@/constants';
import { StatusService } from '@/lib/services/StatusService';
import { 
  Trash,
  CheckCircle,
  XCircle,
  PlusCircle,
  List
} from 'react-bootstrap-icons';

interface StatusManagerProps {
  className?: string;
}

const EmojiPickerService = {
  handleEmojiSelect: (emoji: string, onSelect: (emoji: string) => void, onClose: () => void) => {
    onSelect(emoji);
    onClose();
  },
};

const EmojiButton = ({ 
  emoji, 
  isSelected, 
  onClick 
}: { 
  emoji: string; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xl p-2 rounded hover:bg-secondary-100 dark:hover:bg-dark-700 transition-colors ${
      isSelected ? 'bg-primary-100 dark:bg-primary-900/20' : ''
    }`}
  >
    {emoji}
  </button>
);

const EmojiPicker = ({ 
  selectedEmoji, 
  onEmojiSelect, 
  onClose 
}: { 
  selectedEmoji: string; 
  onEmojiSelect: (emoji: string) => void; 
  onClose: () => void;
}) => (
  <div className="absolute top-full left-0 mt-2 bg-white dark:bg-dark-800 border border-secondary-200 dark:border-dark-600 rounded-lg shadow-lg z-50 p-4 w-64 max-w-[calc(100vw-2rem)]">
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-medium text-secondary-900 dark:text-white">Choose Emoji</h4>
      <button
        onClick={onClose}
        className="text-secondary-400 dark:text-dark-500 hover:text-secondary-600 dark:hover:text-dark-300 flex-shrink-0"
      >
        <XCircle size={16} />
      </button>
    </div>
    <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
      {STATUS_CONFIG.POPULAR_EMOJIS.map((emoji) => (
        <EmojiButton
          key={emoji}
          emoji={emoji}
          isSelected={selectedEmoji === emoji}
          onClick={() => EmojiPickerService.handleEmojiSelect(emoji, onEmojiSelect, onClose)}
        />
      ))}
    </div>
  </div>
);



const StatusHistoryItem = ({ status }: { status: UserStatus }) => (
  <div className={STATUS_STYLES.HISTORY_ITEM}>
    <div className="flex items-center space-x-3">
      <span className="text-lg">{status.emoji}</span>
      <div>
        <p className="text-sm font-medium text-secondary-900 dark:text-white">
          {status.message}
        </p>
        <p className="text-xs text-secondary-500 dark:text-dark-400">
          {StatusService.formatStatusDateTime(status.createdAt)}
        </p>
      </div>
    </div>
    <div className={`w-2 h-2 rounded-full ${
      status.isActive ? 'bg-green-400' : 'bg-gray-400'
    }`}></div>
  </div>
);

const EmptyHistory = () => (
  <p className="text-secondary-600 dark:text-dark-300 text-center py-4">
    No status history yet
  </p>
);

const StatusHistoryHeader = ({ 
  hasHistory, 
  onClearHistory 
}: { 
  hasHistory: boolean; 
  onClearHistory: () => void;
}) => (
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
      Recent Status History
    </h3>
    {hasHistory && (
      <button
        onClick={onClearHistory}
        className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
      >
        Clear History
      </button>
    )}
  </div>
);

const StatusHistory = ({ 
  history, 
  onClearHistory 
}: { 
  history: UserStatus[]; 
  onClearHistory: () => void;
}) => (
  <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6 mt-6`}>
    <StatusHistoryHeader hasHistory={history.length > 0} onClearHistory={onClearHistory} />
    
    {history.length === 0 ? (
      <EmptyHistory />
    ) : (
      <div className="space-y-3">
        {history.map((status) => (
          <StatusHistoryItem key={status.id} status={status} />
        ))}
      </div>
    )}
  </div>
);

const StatusManagerService = {
  async fetchCurrentStatus(): Promise<UserStatus | null> {
    try {
      return await statusApi.getMyStatus();
    } catch {
      return null;
    }
  },

  async fetchStatusHistory(): Promise<UserStatus[]> {
    try {
      return await statusApi.getStatusHistory(STATUS_SERVICE.DEFAULT_HISTORY_LIMIT);
    } catch {
      return [];
    }
  },

  async setPredefinedStatus(predefinedStatus: (typeof STATUS_CONFIG.PREDEFINED_STATUSES)[number]): Promise<UserStatus | null> {
    try {
      const statusData: CreateStatusRequest = {
        emoji: predefinedStatus.emoji,
        message: predefinedStatus.description,
        predefinedStatusId: predefinedStatus.id,
        clearAfter: 'today',
      };
      return await statusApi.setStatus(statusData);
    } catch {
      return null;
    }
  },

  async setCustomStatus(emoji: string, message: string, clearAfter: number | 'today' | 'week' | 'never'): Promise<UserStatus | null> {
    if (!message.trim()) return null;
    
    try {
      const statusData: CreateStatusRequest = {
        emoji,
        message: message.trim(),
        clearAfter,
      };
      return await statusApi.setStatus(statusData);
    } catch {
      return null;
    }
  },

  async clearStatus(): Promise<boolean> {
    try {
      await statusApi.clearStatus();
      return true;
    } catch {
      return false;
    }
  },
};

const useStatusManager = () => {
  const [currentStatus, setCurrentStatus] = useState<UserStatus | null>(null);
  const [statusHistory, setStatusHistory] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshData = async () => {
    const [status, history] = await Promise.all([
      StatusManagerService.fetchCurrentStatus(),
      StatusManagerService.fetchStatusHistory()
    ]);
    setCurrentStatus(status);
    setStatusHistory(history);
  };

  const fetchCurrentStatus = async () => {
    const status = await StatusManagerService.fetchCurrentStatus();
    setCurrentStatus(status);
    setLoading(false);
    return status;
  };

  const fetchStatusHistory = async () => {
    const history = await StatusManagerService.fetchStatusHistory();
    setStatusHistory(history);
  };

  const handlePredefinedStatus = async (predefinedStatus: (typeof STATUS_CONFIG.PREDEFINED_STATUSES)[number]) => {
    setSaving(true);
    await StatusManagerService.setPredefinedStatus(predefinedStatus);
    await refreshData();
    setSaving(false);
  };

  const handleCustomStatus = async (emoji: string, message: string, clearAfter: number | 'today' | 'week' | 'never', onSuccess: () => void) => {
    setSaving(true);
    const result = await StatusManagerService.setCustomStatus(emoji, message, clearAfter);
    if (result) {
      await refreshData();
      onSuccess();
    }
    setSaving(false);
  };

  const handleClearStatus = async () => {
    setSaving(true);
    const success = await StatusManagerService.clearStatus();
    if (success) {
      setCurrentStatus(null);
      await fetchStatusHistory();
    }
    setSaving(false);
  };

  return {
    currentStatus,
    statusHistory,
    loading,
    saving,
    fetchCurrentStatus,
    fetchStatusHistory,
    handlePredefinedStatus,
    handleCustomStatus,
    handleClearStatus,
  };
};

const StatusManager: React.FC<StatusManagerProps> = ({ className = '' }) => {
  const {
    currentStatus,
    statusHistory,
    loading,
    saving,
    fetchCurrentStatus,
    fetchStatusHistory,
    handlePredefinedStatus,
    handleCustomStatus,
    handleClearStatus,
  } = useStatusManager();
  
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(STATUS_CONFIG.DEFAULT_EMOJI);
  const [customMessage, setCustomMessage] = useState('');
  const [clearAfter, setClearAfter] = useState<number | 'today' | 'week' | 'never'>('never');

  useEffect(() => {
    const initializeStatus = async () => {
      const status = await fetchCurrentStatus();
      if (status) {
        setSelectedEmoji(status.emoji);
        setCustomMessage(status.message);
      }
    };
    
    initializeStatus();
    fetchStatusHistory();
  }, [fetchCurrentStatus, fetchStatusHistory]);

  const onCustomStatusSubmit = async () => {
    await handleCustomStatus(selectedEmoji, customMessage, clearAfter, () => {
      setIsCustomMode(false);
      setCustomMessage('');
    });
  };



  if (loading) {
    return (
      <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-full ${className}`}>
      <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6 w-full overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 mb-6 w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            Live Status
          </h2>
          {currentStatus && (
            <button
              onClick={handleClearStatus}
              disabled={saving}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors w-full sm:w-auto"
            >
              <Trash size={14} />
              <span>Clear Status</span>
            </button>
          )}
        </div>

        {/* Current Status Display */}
        {currentStatus && (
          <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700 w-full">
            <div className="flex items-center space-x-3 w-full">
              <div className="relative flex-shrink-0">
                <span className="text-2xl">{currentStatus.emoji}</span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-secondary-900 dark:text-white truncate">
                  {currentStatus.message}
                </p>
                <p className="text-sm text-secondary-600 dark:text-dark-300 truncate">
                  Active since {new Date(currentStatus.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6 w-full">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:flex-1 ${
              !isCustomMode
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-dark-700 text-secondary-700 dark:text-dark-300'
            }`}
          >
            <List size={16} />
            <span>Quick Status</span>
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:flex-1 ${
              isCustomMode
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-dark-700 text-secondary-700 dark:text-dark-300'
            }`}
          >
            <PlusCircle size={16} />
            <span>Custom Status</span>
          </button>
        </div>

        {/* Predefined Statuses */}
        {!isCustomMode && (
          <div className="grid grid-cols-1 gap-3">
            {STATUS_CONFIG.PREDEFINED_STATUSES.map((status) => (
              <button
                key={status.id}
                onClick={() => handlePredefinedStatus(status)}
                disabled={saving}
                className="flex items-center space-x-3 p-4 text-left bg-white dark:bg-dark-800 border border-secondary-200 dark:border-dark-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors disabled:opacity-50 w-full"
              >
                <span className="text-xl flex-shrink-0">{status.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-secondary-900 dark:text-white truncate">
                    {status.label}
                  </p>
                  <p className="text-sm text-secondary-600 dark:text-dark-300 truncate">
                    {status.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Custom Status Form */}
        {isCustomMode && (
          <div className="space-y-4 w-full">
            <div className="flex space-x-4 w-full">
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center justify-center w-12 h-12 text-2xl bg-white dark:bg-dark-800 border border-secondary-200 dark:border-dark-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  {selectedEmoji}
                </button>
                {showEmojiPicker && (
                  <EmojiPicker
                    selectedEmoji={selectedEmoji}
                    onEmojiSelect={setSelectedEmoji}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="What's your status?"
                  maxLength={STATUS_CONFIG.MAX_MESSAGE_LENGTH}
                  className="w-full px-4 py-3 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
                />
                <p className="text-xs text-secondary-500 dark:text-dark-400 mt-1">
                  {customMessage.length}/{STATUS_CONFIG.MAX_MESSAGE_LENGTH} characters
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Clear status
              </label>
              <select
                value={clearAfter}
                onChange={(e) => setClearAfter(e.target.value as number | 'today' | 'week' | 'never')}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white"
              >
                {STATUS_CONFIG.CLEAR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full">
              <button
                onClick={onCustomStatusSubmit}
                disabled={!customMessage.trim() || saving}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors w-full sm:w-auto"
              >
                <CheckCircle size={16} />
                <span>{saving ? 'Setting...' : 'Set Status'}</span>
              </button>
              <button
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomMessage('');
                }}
                className="px-4 py-2 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white transition-colors w-full sm:w-auto text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status History */}
      <StatusHistory 
        history={statusHistory} 
        onClearHistory={fetchStatusHistory}
      />
    </div>
  );
};

export default StatusManager; 