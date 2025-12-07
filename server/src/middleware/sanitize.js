/**
 * Input Sanitization Middleware
 * =============================
 * Protects against NoSQL injection and XSS attacks.
 * 
 * NoSQL Injection: Attackers try to inject operators like $gt, $ne
 *   Example: { email: { "$gt": "" } } would bypass authentication
 * 
 * XSS: Attackers inject malicious scripts
 *   Example: <script>stealCookies()</script>
 */

/**
 * Sanitize a string value by removing dangerous characters
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  // Remove HTML tags
  let clean = str.replace(/<[^>]*>/g, '');
  
  // Encode special HTML characters
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  clean = clean.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
  
  // Remove null bytes
  clean = clean.replace(/\0/g, '');
  
  return clean;
};

/**
 * Deep sanitize an object recursively
 */
const sanitizeObject = (obj, options = {}) => {
  if (obj === null || obj === undefined) return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }
  
  // Handle objects
  if (typeof obj === 'object') {
    const sanitized = {};
    
    for (const key of Object.keys(obj)) {
      // Check for NoSQL injection operators
      if (key.startsWith('$')) {
        // Skip MongoDB operators - they're injection attempts
        if (options.removeMongoOperators !== false) {
          continue;
        }
      }
      
      // Recursively sanitize nested values
      sanitized[key] = sanitizeObject(obj[key], options);
    }
    
    return sanitized;
  }
  
  // Handle strings
  if (typeof obj === 'string') {
    return options.sanitizeStrings !== false ? sanitizeString(obj) : obj;
  }
  
  // Return primitives as-is
  return obj;
};

/**
 * NoSQL Injection Protection Middleware
 * Removes MongoDB operators from request body, query, and params
 */
const mongoSanitize = (options = {}) => {
  return (req, res, next) => {
    if (req.body) {
      req.body = sanitizeObject(req.body, { 
        removeMongoOperators: true,
        sanitizeStrings: false // Only remove operators, not XSS
      });
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query, {
        removeMongoOperators: true,
        sanitizeStrings: false
      });
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params, {
        removeMongoOperators: true,
        sanitizeStrings: false
      });
    }
    
    next();
  };
};

/**
 * XSS Protection Middleware
 * Sanitizes all string inputs to prevent script injection
 */
const xssSanitize = (options = {}) => {
  const { excludePaths = [], excludeFields = [] } = options;
  
  return (req, res, next) => {
    // Skip certain paths if needed
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }
    
    const sanitizeWithExclusions = (obj) => {
      if (obj === null || obj === undefined) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(item => sanitizeWithExclusions(item));
      }
      
      if (typeof obj === 'object') {
        const sanitized = {};
        for (const key of Object.keys(obj)) {
          if (excludeFields.includes(key)) {
            sanitized[key] = obj[key];
          } else {
            sanitized[key] = sanitizeWithExclusions(obj[key]);
          }
        }
        return sanitized;
      }
      
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      }
      
      return obj;
    };
    
    if (req.body) {
      req.body = sanitizeWithExclusions(req.body);
    }
    
    if (req.query) {
      req.query = sanitizeWithExclusions(req.query);
    }
    
    next();
  };
};

/**
 * Combined sanitization middleware
 * Applies both NoSQL injection and XSS protection
 */
const sanitize = (options = {}) => {
  return (req, res, next) => {
    // Remove MongoDB operators
    if (req.body) {
      req.body = sanitizeObject(req.body, { removeMongoOperators: true, sanitizeStrings: true });
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query, { removeMongoOperators: true, sanitizeStrings: true });
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params, { removeMongoOperators: true, sanitizeStrings: true });
    }
    
    next();
  };
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  mongoSanitize,
  xssSanitize,
  sanitize,
};

