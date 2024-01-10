const env = {
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "env not set",
    SYNCLABS_API_KEY: process.env.SYNCLABS_API_KEY || "env not set",
    SUPABASE_URL: process.env.SUPABASE_URL || "env not set",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "env not set",
    AWS_LAMBDA_UPLOAD_YOUTUBE_TO_S3_URL: process.env.AWS_LAMBDA_UPLOAD_YOUTUBE_TO_S3_URL || "env not set",
    SYNCLABS_API_URL: process.env.SYNCLABS_API_URL || "env not set",
}

export default env;