import { FORM_VALIDATION } from '@/constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ValidationService {
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!FORM_VALIDATION.EMAIL_REGEX.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  static validateUrl(url: string): { isValid: boolean; error?: string } {
    if (!url.trim()) {
      return { isValid: true };
    }
    
    if (!FORM_VALIDATION.URL_REGEX.test(url)) {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
    
    return { isValid: true };
  }

  static validateRequired(value: string, fieldName: string): { isValid: boolean; error?: string } {
    if (!value.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    return { isValid: true };
  }

  static validateSlug(slug: string): { isValid: boolean; error?: string } {
    if (!slug.trim()) {
      return { isValid: false, error: 'Slug is required' };
    }
    
    if (!FORM_VALIDATION.SLUG_REGEX.test(slug)) {
      return { isValid: false, error: 'Slug must contain only lowercase letters, numbers, and hyphens' };
    }
    
    return { isValid: true };
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static validateContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): ValidationResult {
    const errors: Record<string, string> = {};

    const nameValidation = this.validateRequired(data.name, 'Name');
    if (!nameValidation.isValid) errors.name = nameValidation.error!;

    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error!;

    const subjectValidation = this.validateRequired(data.subject, 'Subject');
    if (!subjectValidation.isValid) errors.subject = subjectValidation.error!;

    const messageValidation = this.validateRequired(data.message, 'Message');
    if (!messageValidation.isValid) errors.message = messageValidation.error!;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const validator = new ValidationService(); 