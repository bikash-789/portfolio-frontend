import { FORM_VALIDATION, ADMIN_FORM_CONFIG } from '../constants';
import { CreateProjectRequest } from '../lib/api/services/projects';

export type ProjectFormData = CreateProjectRequest;

export interface ValidationErrors {
  [key: string]: string;
}

export class ProjectFormService {
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static validateField(name: string, value: any): string | null {
    const config = ADMIN_FORM_CONFIG.PROJECT;
    const messages = ADMIN_FORM_CONFIG.VALIDATION_MESSAGES;

    switch (name) {
      case 'title':
        if (!value || typeof value !== 'string' || !value.trim()) return messages.TITLE_REQUIRED;
        if (value.length < config.MIN_TITLE_LENGTH) return messages.TITLE_TOO_SHORT;
        if (value.length > config.MAX_TITLE_LENGTH) return messages.TITLE_TOO_LONG;
        break;

      case 'description':
        if (!value || typeof value !== 'string' || !value.trim()) return messages.DESCRIPTION_REQUIRED;
        if (value.length < config.MIN_DESCRIPTION_LENGTH) return messages.DESCRIPTION_TOO_SHORT;
        if (value.length > config.MAX_DESCRIPTION_LENGTH) return messages.DESCRIPTION_TOO_LONG;
        break;

      case 'image':
        if (!value || typeof value !== 'string' || !value.trim()) return messages.IMAGE_REQUIRED;
        if (!FORM_VALIDATION.URL_REGEX.test(value)) return messages.INVALID_IMAGE_URL;
        break;

      case 'category':
        if (!value || typeof value !== 'string' || !value.trim()) return messages.CATEGORY_REQUIRED;
        break;

      case 'slug':
        if (!value || typeof value !== 'string' || !value.trim()) return messages.SLUG_REQUIRED;
        break;

      case 'technologies':
        if (!value?.length || value.length < config.MIN_TECHNOLOGIES) {
          return messages.TECHNOLOGIES_REQUIRED;
        }
        break;

      case 'githubUrl':
        if (value && !FORM_VALIDATION.URL_REGEX.test(value)) return 'Invalid GitHub URL';
        break;

      case 'liveUrl':
        if (value && !FORM_VALIDATION.URL_REGEX.test(value)) return messages.INVALID_LIVE_URL;
        break;

      default:
        break;
    }

    return null;
  }

  static validateAllFields(formData: ProjectFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    const fieldsToValidate = [
      'title',
      'description', 
      'image',
      'category',
      'slug',
      'technologies',
      'githubUrl'
    ];

    fieldsToValidate.forEach(field => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = this.validateField(field, (formData as any)[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }

  static isFormValid(formData: ProjectFormData): boolean {
    const errors = this.validateAllFields(formData);
    return Object.keys(errors).length === 0;
  }

  static async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = this.generateSlug(title);
    
    return baseSlug;
  }

  static formatFormData(formData: ProjectFormData): ProjectFormData {
    return {
      ...formData,
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      slug: formData.slug?.trim() || this.generateSlug(formData.title || ''),
      category: formData.category?.trim(),
      githubUrl: formData.githubUrl?.trim(),
      liveUrl: formData.liveUrl?.trim(),
    };
  }
}

export const projectFormService = new ProjectFormService(); 