module.exports = {
    name: 'sync-app',
    version: '1.0.0',
    extra: {
        clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
        syncLabsApiKey: process.env.SYNCLABS_API_KEY,
        syncLabsApiUrl: process.env.SYNCLABS_API_URL,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
        youtubeToS3Url: process.env.AWS_LAMBDA_UPLOAD_YOUTUBE_TO_S3_URL,
    },
};