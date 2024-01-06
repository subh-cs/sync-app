module.exports = {
    name: 'sync-app',
    version: '1.0.0',
    extra: {
        clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        syncLabsApiKey: process.env.SYNC_LABS_API_KEY,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
};