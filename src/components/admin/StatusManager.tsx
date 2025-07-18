'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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

interface StatusState {
  currentStatus: UserStatus | null;
  statusHistory: UserStatus[];
  loading: boolean;
  saving: boolean;
}

interface UIState {
  isCustomMode: boolean;
  showEmojiPicker: boolean;
  selectedEmoji: string;
  customMessage: string;
  clearAfter: number | 'today' | 'week' | 'never';
}

const useStatusManagement = () => {
  const isInitialMount = useRef(true);
  const [state, setState] = useState<StatusState>({
    currentStatus: null,
    statusHistory: [],
    loading: true,
    saving: false,
  });

  const fetchCurrentStatus = useCallback(async () => {
    try {
      const status = await statusApi.getMyStatus();
      setState(prev => ({ 
        ...prev, 
        currentStatus: status, 
        loading: false 
      }));
      return status;
    } catch {
      setState(prev => ({ 
        ...prev, 
        currentStatus: null, 
        loading: false 
      }));
      return null;
    }
  }, []);

  const fetchStatusHistory = useCallback(async () => {
    try {
      const history = await statusApi.getStatusHistory(STATUS_SERVICE.DEFAULT_HISTORY_LIMIT);
      setState(prev => ({ ...prev, statusHistory: history }));
    } catch {
      setState(prev => ({ ...prev, statusHistory: [] }));
    }
  }, []);

  const refreshData = useCallback(async () => {
    const [status, history] = await Promise.all([
      statusApi.getMyStatus().catch(() => null),
      statusApi.getStatusHistory(STATUS_SERVICE.DEFAULT_HISTORY_LIMIT).catch(() => [])
    ]);
    setState(prev => ({ 
      ...prev, 
      currentStatus: status, 
      statusHistory: history 
    }));
  }, []);

  const setSaving = useCallback((saving: boolean) => {
    setState(prev => ({ ...prev, saving }));
  }, []);

  const clearCurrentStatus = useCallback(() => {
    setState(prev => ({ ...prev, currentStatus: null }));
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchCurrentStatus();
      fetchStatusHistory();
    }
  }, [fetchCurrentStatus, fetchStatusHistory]);

  return {
    ...state,
    fetchCurrentStatus,
    fetchStatusHistory,
    refreshData,
    setSaving,
    clearCurrentStatus,
  };
};

const useStatusActions = (
  refreshData: () => Promise<void>,
  fetchStatusHistory: () => Promise<void>,
  setSaving: (saving: boolean) => void,
  clearCurrentStatus: () => void
) => {
  const handlePredefinedStatus = useCallback(async (predefinedStatus: (typeof STATUS_CONFIG.PREDEFINED_STATUSES)[number]) => {
    setSaving(true);
    try {
      const statusData: CreateStatusRequest = {
        emoji: predefinedStatus.emoji,
        message: predefinedStatus.description,
        predefinedStatusId: predefinedStatus.id,
        clearAfter: 'today',
      };
      await statusApi.setStatus(statusData);
      await refreshData();
    } catch {
    } finally {
      setSaving(false);
    }
  }, [refreshData, setSaving]);

  const handleCustomStatus = useCallback(async (
    emoji: string, 
    message: string, 
    clearAfter: number | 'today' | 'week' | 'never', 
    onSuccess: () => void
  ) => {
    if (!message.trim()) return;
    
    setSaving(true);
    try {
      const statusData: CreateStatusRequest = {
        emoji,
        message: message.trim(),
        clearAfter,
      };
      await statusApi.setStatus(statusData);
      await refreshData();
      onSuccess();
    } catch {
    } finally {
      setSaving(false);
    }
  }, [refreshData, setSaving]);

  const handleClearStatus = useCallback(async () => {
    setSaving(true);
    try {
      await statusApi.clearStatus();
      clearCurrentStatus();
      await fetchStatusHistory();
    } catch {
    } finally {
      setSaving(false);
    }
  }, [clearCurrentStatus, fetchStatusHistory, setSaving]);

  return {
    handlePredefinedStatus,
    handleCustomStatus,
    handleClearStatus,
  };
};

const useUIState = (currentStatus: UserStatus | null) => {
  const [uiState, setUIState] = useState<UIState>({
    isCustomMode: false,
    showEmojiPicker: false,
    selectedEmoji: STATUS_CONFIG.DEFAULT_EMOJI,
    customMessage: '',
    clearAfter: 'never',
  });

  useEffect(() => {
    if (currentStatus) {
      setUIState(prev => ({
        ...prev,
        selectedEmoji: currentStatus.emoji,
        customMessage: currentStatus.message,
      }));
    }
  }, [currentStatus]);

  const updateUIState = useCallback((updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  }, []);

  const setSelectedEmoji = useCallback((emoji: string) => {
    setUIState(prev => ({ ...prev, selectedEmoji: emoji }));
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setUIState(prev => ({ ...prev, showEmojiPicker: !prev.showEmojiPicker }));
  }, []);

  const closeEmojiPicker = useCallback(() => {
    setUIState(prev => ({ ...prev, showEmojiPicker: false }));
  }, []);

  return {
    uiState,
    updateUIState,
    setSelectedEmoji,
    toggleEmojiPicker,
    closeEmojiPicker,
  };
};

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

const StatusManager: React.FC<StatusManagerProps> = ({ className = '' }) => {
  const {
    currentStatus,
    statusHistory,
    loading,
    saving,
    fetchStatusHistory,
    refreshData,
    setSaving,
    clearCurrentStatus,
  } = useStatusManagement();
  
  const {
    uiState,
    updateUIState,
    setSelectedEmoji,
    toggleEmojiPicker,
    closeEmojiPicker,
  } = useUIState(currentStatus);

  const {
    handlePredefinedStatus,
    handleCustomStatus,
    handleClearStatus,
  } = useStatusActions(refreshData, fetchStatusHistory, setSaving, clearCurrentStatus);

  const onCustomStatusSubmit = async () => {
    await handleCustomStatus(uiState.selectedEmoji, uiState.customMessage, uiState.clearAfter, () => {
      updateUIState({ isCustomMode: false, customMessage: '' });
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
            onClick={() => updateUIState({ isCustomMode: false })}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:flex-1 ${
              !uiState.isCustomMode
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-dark-700 text-secondary-700 dark:text-dark-300'
            }`}
          >
            <List size={16} />
            <span>Quick Status</span>
          </button>
          <button
            onClick={() => updateUIState({ isCustomMode: true })}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors w-full sm:flex-1 ${
              uiState.isCustomMode
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-dark-700 text-secondary-700 dark:text-dark-300'
            }`}
          >
            <PlusCircle size={16} />
            <span>Custom Status</span>
          </button>
        </div>

        {/* Predefined Statuses */}
        {!uiState.isCustomMode && (
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
        {uiState.isCustomMode && (
          <div className="space-y-4 w-full">
            <div className="flex space-x-4 w-full">
              <div className="relative flex-shrink-0">
                <button
                  onClick={toggleEmojiPicker}
                  className="flex items-center justify-center w-12 h-12 text-2xl bg-white dark:bg-dark-800 border border-secondary-200 dark:border-dark-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  {uiState.selectedEmoji}
                </button>
                {uiState.showEmojiPicker && (
                  <EmojiPicker
                    selectedEmoji={uiState.selectedEmoji}
                    onEmojiSelect={setSelectedEmoji}
                    onClose={closeEmojiPicker}
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={uiState.customMessage}
                  onChange={(e) => updateUIState({ customMessage: e.target.value })}
                  placeholder="What's your status?"
                  maxLength={STATUS_CONFIG.MAX_MESSAGE_LENGTH}
                  className="w-full px-4 py-3 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-700 text-secondary-900 dark:text-white placeholder-secondary-500 dark:placeholder-dark-400"
                />
                <p className="text-xs text-secondary-500 dark:text-dark-400 mt-1">
                  {uiState.customMessage.length}/{STATUS_CONFIG.MAX_MESSAGE_LENGTH} characters
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-2">
                Clear status
              </label>
              <select
                value={uiState.clearAfter}
                onChange={(e) => updateUIState({ clearAfter: e.target.value as number | 'today' | 'week' | 'never' })}
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
                disabled={!uiState.customMessage.trim() || saving}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors w-full sm:w-auto"
              >
                <CheckCircle size={16} />
                <span>{saving ? 'Setting...' : 'Set Status'}</span>
              </button>
              <button
                onClick={() => {
                  updateUIState({ isCustomMode: false, customMessage: '' });
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
        onClearHistory={() => {
          fetchStatusHistory();
        }}
      />
    </div>
  );
};

export default StatusManager; 
