import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Password hashing function (same as lib/password.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function createUser() {
  const username = process.argv[2] || 'testuser';
  const password = process.argv[3] || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const hashedPassword = hashPassword(password);

  try {
    const { data, error } = await supabase
      .from('user_table')
      .insert([
        {
          Username: username,
          password: hashedPassword,
        },
      ])
      .select();

    if (error) {
      console.error('Error creating user:', error);
      process.exit(1);
    }

    console.log('\n✓ User created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nSave these credentials securely!');
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

createUser();
