import DOMPurify from 'dompurify';

export const sanitizeHtml = (value: string): string =>
  DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
    ALLOWED_ATTR: []
  });
