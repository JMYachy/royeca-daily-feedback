import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
  try {
    const { data, error } = await supabase
      .from('user_table')
      .select('User_ID, Username, password');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log('Users in database:');
    if (data && data.length > 0) {
      data.forEach(user => {
        console.log(`- Username: ${user.Username}, ID: ${user.User_ID}`);
      });
    } else {
      console.log('No users found in database');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

checkUsers();
