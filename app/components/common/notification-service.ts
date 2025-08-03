'use client';
import { toast } from 'sonner';

interface NotificationOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const NotificationService = {
  success: (message: string, options: Partial<NotificationOptions> = {}) => {
    return toast.success(message, {
      duration: 4000,
      ...options,
    });
  },

  error: (message: string, options: Partial<NotificationOptions> = {}) => {
    return toast.error(message, {
      duration: 6000,
      ...options,
    });
  },

  info: (message: string, options: Partial<NotificationOptions> = {}) => {
    return toast.info(message, {
      duration: 4000,
      ...options,
    });
  },

  warning: (message: string, options: Partial<NotificationOptions> = {}) => {
    return toast.warning(message, {
      duration: 5000,
      ...options,
    });
  },

  authError: (title: string, description: string) => {
    return toast.error(title, {
      description,
      duration: 8000,
    });
  },

  profileUpdated: (userType: string = 'Profile') => {
    return toast.success(`${userType} updated successfully!`, {
      description: 'Your changes have been saved.',
      duration: 4000,
    });
  },

  requestSent: (count: number = 1) => {
    console.log('requestSent called with count:', count);
    return toast.success(
      count === 1
        ? 'Request sent successfully!'
        : `${count} requests sent successfully!`,
      {
        description: 'Alumni will be notified via email.',
        duration: 4000,
      }
    );
  },

  requestAccepted: (alumniName: string) => {
    return toast.success('Chat request accepted!', {
      description: `${alumniName} accepted your request. You can now start chatting.`,
      duration: 5000,
    });
  },

  requestDeclined: (alumniName: string) => {
    return toast.error('Chat request declined', {
      description: `${alumniName} declined your request. Try reaching out to other alumni.`,
      duration: 5000,
    });
  },

  // For alumni when they accept/decline requests
  requestProcessed: (action: 'accepted' | 'declined') => {
    const isAccepted = action === 'accepted';
    return toast[isAccepted ? 'success' : 'error'](
      `Request ${action} successfully!`,
      {
        description: isAccepted
          ? 'The student will be notified and can now start chatting with you.'
          : 'The student will be notified.',
        duration: 4000,
      }
    );
  },

  custom: (
    message: string,
    type: string = 'default',
    options: Partial<NotificationOptions> = {}
  ) => {
    switch (type) {
      case 'success':
        return NotificationService.success(message, options);
      case 'error':
        return NotificationService.error(message, options);
      case 'warning':
        return NotificationService.warning(message, options);
      case 'info':
        return NotificationService.info(message, options);
      default:
        return toast(message, {
          duration: 4000,
          ...options,
        });
    }
  },
};

export const {
  success,
  error,
  info,
  warning,
  authError,
  profileUpdated,
  requestSent,
  requestAccepted,
  requestDeclined,
  requestProcessed,
  custom,
} = NotificationService;

export default NotificationService;
