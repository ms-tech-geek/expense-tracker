import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_CATEGORIES } from '../src/data/categories';
import { setTimeout } from 'timers/promises';

// Load environment variables from .env file
config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Required environment variables are missing. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 2000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await setTimeout(delay);
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

async function createDemoUser() {
  const email = 'demo@example.com';
  const password = 'demo123456';

  return withRetry(async () => {
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (userError) {
      throw userError;
    }

    console.log('Created demo user:', email);
    return userData.user;
  });
}

async function createExpenses(userId: string) {
  const today = new Date();
  const expenses = [];

  // Get child categories (those with parent_id)
  const childCategories = DEFAULT_CATEGORIES.filter(cat => cat.parent_id);

  // Generate expenses for the last 90 days
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate 1-3 expenses per day
    const dailyExpenses = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < dailyExpenses; j++) {
      // Random category
      const category = childCategories[Math.floor(Math.random() * childCategories.length)];
      
      // Random amount between 10 and 1000
      const amount = Math.round((Math.random() * 990 + 10) * 100) / 100;

      expenses.push({
        user_id: userId,
        amount,
        category: category.id,
        description: `Demo ${category.name}`,
        expense_date: date.toISOString(),
        created_at: date.toISOString(),
        updated_at: date.toISOString()
      });
    }
  }

  // Insert expenses in smaller batches of 10 with retry logic
  for (let i = 0; i < expenses.length; i += 10) {
    const batch = expenses.slice(i, i + 10);
    await withRetry(async () => {
      const { error } = await supabase.from('expenses').insert(batch);
      if (error) throw error;
      console.log(`Inserted batch ${Math.floor(i/10) + 1}/${Math.ceil(expenses.length/10)}`);
    });
  }

  console.log(`Created ${expenses.length} demo expenses`);
}

async function seed() {
  try {
    const user = await createDemoUser();
    await createExpenses(user.id);
    console.log('Seeding completed successfully!');
    console.log('\nDemo Account:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123456');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();