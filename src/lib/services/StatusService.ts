import { STATUS_CONFIG, STATUS_SERVICE } from '@/constants';
import { UserStatus } from '@/lib/api/services/status';

export class StatusService {
  static getStatusStyleCategory(statusId: string): 'busy' | 'away' | 'online' {
    if (STATUS_SERVICE.STATUS_CATEGORIES.BUSY_TYPES.includes(statusId as typeof STATUS_SERVICE.STATUS_CATEGORIES.BUSY_TYPES[number])) {
      return 'busy';
    }
    if (STATUS_SERVICE.STATUS_CATEGORIES.AWAY_TYPES.includes(statusId as typeof STATUS_SERVICE.STATUS_CATEGORIES.AWAY_TYPES[number])) {
      return 'away';
    }
    return 'online';
  }

  static findPredefinedStatus(emoji: string) {
    return STATUS_CONFIG.PREDEFINED_STATUSES.find(s => s.emoji === emoji);
  }

  static formatTimeAgo(dateString: string): string {
    const now = new Date();
    const updated = new Date(dateString);
    
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays}d ago`;
  }

  static formatStatusDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      ...STATUS_SERVICE.TIME_FORMAT_OPTIONS
    });
  }

  static formatStatusDateTime(dateString: string): string {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-IN');
    const timeStr = date.toLocaleTimeString('en-IN');
    return `${dateStr} at ${timeStr}`;
  }

  static formatIndianTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  static isStatusActive(status: UserStatus): boolean {
    if (!status.isActive) return false;
    
    if (status.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(status.expiresAt);
      return now < expiresAt;
    }
    
    return true;
  }

  static calculateExpirationTime(clearAfter: number | 'today' | 'week' | 'never'): Date | null {
    if (clearAfter === 'never') return null;
    
    const now = new Date();
    
    if (typeof clearAfter === 'number') {
      return new Date(now.getTime() + clearAfter * 60 * 1000);
    }
    
    if (clearAfter === 'today') {
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay;
    }
    
    if (clearAfter === 'week') {
      const endOfWeek = new Date(now);
      const daysUntilSunday = 7 - now.getDay();
      endOfWeek.setDate(now.getDate() + daysUntilSunday);
      endOfWeek.setHours(23, 59, 59, 999);
      return endOfWeek;
    }
    
    return null;
  }

  static validateStatusMessage(message: string): boolean {
    return message.trim().length > 0 && message.length <= STATUS_CONFIG.MAX_MESSAGE_LENGTH;
  }

  static sanitizeStatusMessage(message: string): string {
    return message.trim().substring(0, STATUS_CONFIG.MAX_MESSAGE_LENGTH);
  }
} 