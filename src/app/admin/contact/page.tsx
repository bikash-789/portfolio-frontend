'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { contactApi, Contact, ContactFilters } from '@/lib/api/services/contact';
import { useApi } from '@/lib/api/hooks/useApi';
import { ADMIN_STYLES, ADMIN_PAGES, STATUS_COLORS } from '@/constants';
import {
  Envelope,
  EnvelopeOpen,
  Reply,
  Archive,
  Trash,
  Eye,
  Search,
} from 'react-bootstrap-icons';

type StatusFilter = 'all' | 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
type SortField = 'createdAt' | 'name' | 'email' | 'status';
type SortOrder = 'asc' | 'desc';

interface ContactState {
  messages: Contact[];
  loading: boolean;
  error: string | null;
}

interface FilterState {
  searchTerm: string;
  selectedStatus: StatusFilter;
  sortBy: SortField;
  sortOrder: SortOrder;
}

const useContactMessages = () => {
  const isInitialMount = useRef(true);
  const [state, setState] = useState<ContactState>({
    messages: [],
    loading: true,
    error: null,
  });

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedStatus: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: stats, execute: fetchStats } = useApi(contactApi.getContactStats, false);

  const fetchMessages = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const apiFilters: ContactFilters = {
        limit: 50,
        page: 1,
        search: filters.searchTerm || undefined,
        status: filters.selectedStatus !== 'all' ? filters.selectedStatus : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };
      
      const data = await contactApi.getContacts(apiFilters);
      setState(prev => ({ ...prev, messages: data?.messages || [], loading: false }));
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load messages', 
        messages: [], 
        loading: false 
      }));
    }
  }, [filters.searchTerm, filters.selectedStatus, filters.sortBy, filters.sortOrder]);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);

  const refetchData = useCallback(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeoutId = setTimeout(fetchMessages, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchMessages]);

  return {
    ...state,
    filters,
    stats,
    updateFilters,
    fetchMessages,
    fetchStats,
    refetchData,
  };
};

const useContactActions = (refetchData: () => void) => {
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleViewMessage = useCallback((message: Contact) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    if (message.status === 'UNREAD') {
      contactApi.markAsRead(message.id).then(refetchData);
    }
  }, [refetchData]);

  const handleStatusChange = useCallback(async (messageId: string, newStatus: 'READ' | 'REPLIED' | 'ARCHIVED') => {
    try {
      await contactApi.updateContact(messageId, { status: newStatus });
      refetchData();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  }, [refetchData]);

  const handleDeleteMessage = useCallback(async () => {
    if (!selectedMessage) return;

    try {
      await contactApi.deleteContact(selectedMessage.id);
      setShowDeleteModal(false);
      setSelectedMessage(null);
      refetchData();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, [selectedMessage, refetchData]);

  const resetModals = useCallback(() => {
    setSelectedMessage(null);
    setShowDeleteModal(false);
    setShowMessageModal(false);
  }, []);

  return {
    selectedMessage,
    showDeleteModal,
    showMessageModal,
    setShowDeleteModal,
    setShowMessageModal,
    handleViewMessage,
    handleStatusChange,
    handleDeleteMessage,
    resetModals,
  };
};

const LoadingView = () => (
  <div className={`min-h-screen flex items-center justify-center ${ADMIN_STYLES.GRADIENT_BG}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
      <p className="text-secondary-600 dark:text-dark-300">Loading...</p>
    </div>
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className={ADMIN_STYLES.BACK_BUTTON}>
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const StatsCard = ({ icon, label, value, colorClass }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  colorClass: string; 
}) => (
  <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6`}>
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`h-8 w-8 ${colorClass} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-secondary-500 dark:text-dark-400 truncate">
            {label}
          </dt>
          <dd className="text-lg font-medium text-secondary-900 dark:text-white">
            {value}
          </dd>
        </dl>
      </div>
    </div>
  </div>
);

const SearchAndFilters = ({ 
  filters, 
  updateFilters 
}: { 
  filters: FilterState; 
  updateFilters: (updates: Partial<FilterState>) => void; 
}) => (
  <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} p-6 mb-8`}>
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search messages..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-secondary-900 dark:text-white"
          />
        </div>
      </div>
      
      <select
        value={filters.selectedStatus}
        onChange={(e) => updateFilters({ selectedStatus: e.target.value as StatusFilter })}
        className="px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-secondary-900 dark:text-white"
      >
        <option value="all">All Status</option>
        <option value="UNREAD">Unread</option>
        <option value="READ">Read</option>
        <option value="REPLIED">Replied</option>
        <option value="ARCHIVED">Archived</option>
      </select>
      
      <select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-') as [SortField, SortOrder];
          updateFilters({ sortBy, sortOrder });
        }}
        className="px-3 py-2 border border-secondary-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-secondary-900 dark:text-white"
      >
        <option value="createdAt-desc">Newest First</option>
        <option value="createdAt-asc">Oldest First</option>
        <option value="name-asc">Name A-Z</option>
        <option value="name-desc">Name Z-A</option>
        <option value="email-asc">Email A-Z</option>
        <option value="email-desc">Email Z-A</option>
      </select>
    </div>
  </div>
);

const MessageTableLoading = () => (
  <div className="animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="border-b border-secondary-200 dark:border-dark-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-secondary-200 dark:bg-dark-600 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-secondary-200 dark:bg-dark-600 rounded w-3/4"></div>
            <div className="h-3 bg-secondary-200 dark:bg-dark-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MessageTableError = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="text-red-500 dark:text-red-400 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">Error Loading Messages</h3>
    <p className="text-secondary-600 dark:text-dark-300 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

const MessageTableEmpty = () => (
  <div className="text-center py-12">
    <Envelope className="w-12 h-12 text-secondary-400 dark:text-dark-500 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">No Messages Found</h3>
    <p className="text-secondary-600 dark:text-dark-300">
      There are no messages matching your current filters.
    </p>
  </div>
);

const MessageDetailModal = ({ 
  message, 
  onClose 
}: { 
  message: Contact | null; 
  onClose: () => void; 
}) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {ADMIN_PAGES.CONTACT.MODALS.MESSAGE_DETAIL_TITLE}
          </h3>
          <button
            onClick={onClose}
            className="text-secondary-400 dark:text-dark-500 hover:text-secondary-600 dark:hover:text-dark-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                Name
              </label>
              <p className="text-secondary-900 dark:text-white">{message.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                Email
              </label>
              <p className="text-secondary-900 dark:text-white">{message.email}</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
              Subject
            </label>
            <p className="text-secondary-900 dark:text-white">{message.subject}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
              Message
            </label>
            <div className="bg-secondary-50 dark:bg-dark-700 rounded-lg p-4">
              <p className="text-secondary-900 dark:text-white whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                Status
              </label>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                {getStatusIcon(message.status)}
                <span className="ml-1 capitalize">{message.status}</span>
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                Date
              </label>
              <p className="text-secondary-900 dark:text-white">{formatDate(message.createdAt)}</p>
            </div>
          </div>
          
          {message.ipAddress && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-dark-300 mb-1">
                IP Address
              </label>
              <p className="text-secondary-900 dark:text-white">{message.ipAddress}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white transition-colors duration-300"
          >
            Close
          </button>
          <a
            href={`mailto:${message.email}?subject=Re: ${message.subject}`}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-300"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ 
  message, 
  onConfirm, 
  onCancel 
}: { 
  message: Contact | null; 
  onConfirm: () => void; 
  onCancel: () => void; 
}) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl p-6 max-w-md w-full mx-4`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Trash className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            {ADMIN_PAGES.CONTACT.MODALS.DELETE_TITLE}
          </h3>
        </div>
        <p className="text-secondary-600 dark:text-dark-300 mb-6">
          Are you sure you want to delete this message from &quot;{message.name}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-secondary-700 dark:text-dark-300 hover:text-secondary-900 dark:hover:text-white transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'UNREAD': return STATUS_COLORS.UNREAD;
    case 'read':
    case 'READ': return STATUS_COLORS.READ;
    case 'REPLIED': return STATUS_COLORS.REPLIED;
    case 'ARCHIVED': return STATUS_COLORS.ARCHIVED;
    default: return STATUS_COLORS.UNREAD;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'UNREAD': return <Envelope className="w-4 h-4" />;
    case 'read':
    case 'READ': return <EnvelopeOpen className="w-4 h-4" />;
    case 'REPLIED': return <Reply className="w-4 h-4" />;
    case 'ARCHIVED': return <Archive className="w-4 h-4" />;
    default: return <Envelope className="w-4 h-4" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MessageActions = ({ 
  message, 
  onView, 
  onStatusChange, 
  onDelete 
}: {
  message: Contact;
  onView: (message: Contact) => void;
  onStatusChange: (messageId: string, status: 'READ' | 'REPLIED' | 'ARCHIVED') => void;
  onDelete: (message: Contact) => void;
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => onView(message)}
      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-300"
      title="View Message"
    >
      <Eye size={16} />
    </button>
    
    {message.status === 'UNREAD' && (
      <button
        onClick={() => onStatusChange(message.id, 'READ')}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-300"
        title="Mark as Read"
      >
        <EnvelopeOpen size={16} />
      </button>
    )}
    
    {message.status !== 'REPLIED' && (
      <button
        onClick={() => onStatusChange(message.id, 'REPLIED')}
        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors duration-300"
        title="Mark as Replied"
      >
        <Reply size={16} />
      </button>
    )}
    
    {message.status !== 'ARCHIVED' && (
      <button
        onClick={() => onStatusChange(message.id, 'ARCHIVED')}
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-300"
        title="Archive"
      >
        <Archive size={16} />
      </button>
    )}
    
    <button
      onClick={() => onDelete(message)}
      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-300"
      title="Delete"
    >
      <Trash size={16} />
    </button>
  </div>
);

export default function ContactMessages() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const {
    messages,
    loading,
    error,
    filters,
    stats,
    updateFilters,
    refetchData,
  } = useContactMessages();

  const {
    selectedMessage,
    showDeleteModal,
    showMessageModal,
    handleViewMessage,
    handleStatusChange,
    handleDeleteMessage,
    resetModals,
  } = useContactActions(refetchData);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (isAuthenticated) {
      refetchData();
    }
  }, [isAuthenticated, authLoading, router, refetchData]);

  if (authLoading) return <LoadingView />;

  return (
    <div className={`min-h-screen ${ADMIN_STYLES.GRADIENT_BG}`}>
      <header className={ADMIN_STYLES.HEADER}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BackButton onClick={() => router.back()} />
              <h1 className="text-xl font-bold text-secondary-800 dark:text-white">
                {ADMIN_PAGES.CONTACT.TITLE}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard
              icon={<Envelope className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              label="Total Messages"
              value={stats.total}
              colorClass="bg-blue-100 dark:bg-blue-900/20"
            />
            <StatsCard
              icon={<Envelope className="h-5 w-5 text-red-600 dark:text-red-400" />}
              label="Unread"
              value={stats.unread}
              colorClass="bg-red-100 dark:bg-red-900/20"
            />
            <StatsCard
              icon={<Reply className="h-5 w-5 text-green-600 dark:text-green-400" />}
              label="Replied"
              value={stats.replied}
              colorClass="bg-green-100 dark:bg-green-900/20"
            />
            <StatsCard
              icon={<svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              label="This Week"
              value={stats.thisWeek}
              colorClass="bg-purple-100 dark:bg-purple-900/20"
            />
          </div>
        )}

        <SearchAndFilters 
          filters={filters}
          updateFilters={updateFilters}
        />

        <div className={`${ADMIN_STYLES.CARD_BG} rounded-xl ${ADMIN_STYLES.SHADOW} overflow-hidden`}>
          {loading ? (
            <MessageTableLoading />
          ) : error ? (
            <MessageTableError error={error} onRetry={refetchData} />
          ) : messages.length === 0 ? (
            <MessageTableEmpty />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-secondary-200 dark:divide-dark-700">
                <thead className={ADMIN_STYLES.TABLE_HEADER}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-dark-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-dark-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-dark-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-dark-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-dark-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`${ADMIN_STYLES.CARD_BG} divide-y divide-secondary-200 dark:divide-dark-700`}>
                  {messages.map((message: Contact) => (
                    <tr key={message.id} className={ADMIN_STYLES.TABLE_ROW_HOVER}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                          {getStatusIcon(message.status)}
                          <span className="ml-1 capitalize">{message.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-secondary-900 dark:text-white">
                            {message.name}
                          </div>
                          <div className="text-sm text-secondary-500 dark:text-dark-400">
                            {message.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-secondary-900 dark:text-white max-w-xs truncate">
                          {message.subject}
                        </div>
                        <div className="text-sm text-secondary-500 dark:text-dark-400 max-w-xs truncate">
                          {message.message.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-dark-400">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <MessageActions 
                          message={message}
                          onView={handleViewMessage}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteMessage}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <MessageDetailModal 
        message={showMessageModal ? selectedMessage : null}
        onClose={resetModals}
      />

      <DeleteModal 
        message={showDeleteModal ? selectedMessage : null}
        onConfirm={handleDeleteMessage}
        onCancel={resetModals}
      />
    </div>
  );
} 
