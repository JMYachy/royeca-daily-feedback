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
 * Extracts salt and iterations from stored hash and compares
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    // Extract salt and iterations from stored hash
    const [salt, iterations, hash] = storedHash.split('$');
    
    if (!salt || !iterations || !hash) {
      console.error('Invalid stored password hash format');
      return false;
    }

    // Verify the password with the same salt and iterations
    const computedHash = crypto
      .pbkdf2Sync(password, salt, parseInt(iterations, 10), 64, 'sha256')
      .toString('hex');

    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(computedHash)
    );
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
