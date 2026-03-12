import crypto from 'crypto';

/**
 * Hash a password using PBKDF2 (secure built-in crypto)
 * Format: salt$iterations$hash (stored for later verification)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(32).toString('hex');
  const iterations = 100000; // High number for security
  
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, 64, 'sha256')
    .toString('hex');
  
  return `${salt}$${iterations}$${hash}`;
}

/**
 * Verify a password against a stored hash
 * Supports both old format (salt:hash with sha512) and new format (salt$iterations$hash with sha256)
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    // Try new format first: salt$iterations$hash
    if (storedHash.includes('$')) {
      const [salt, iterations, hash] = storedHash.split('$');
      
      if (!salt || !iterations || !hash) {
        console.error('Invalid stored password hash format (new format)');
        return false;
      }

      const computedHash = crypto
        .pbkdf2Sync(password, salt, parseInt(iterations, 10), 64, 'sha256')
        .toString('hex');

      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(computedHash)
      );
    }
    
    // Fallback to old format: salt:hash (with sha512, 100000 iterations)
    if (storedHash.includes(':')) {
      const [salt, hash] = storedHash.split(':');
      
      if (!salt || !hash) {
        console.error('Invalid stored password hash format (old format)');
        return false;
      }

      const computedHash = crypto
        .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
        .toString('hex');

      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(computedHash)
      );
    }

    console.error('Invalid stored password hash format (unknown separator)');
    return false;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
