import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(value) {
  if (typeof value === 'string') {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    }).trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeInput(item));
  }

  if (value && typeof value === 'object') {
    const sanitizedObject = {};

    for (const [key, itemValue] of Object.entries(value)) {
      sanitizedObject[key] = sanitizeInput(itemValue);
    }

    return sanitizedObject;
  }

  return value;
}
