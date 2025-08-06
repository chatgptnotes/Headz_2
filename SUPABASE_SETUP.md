# Supabase Setup Guide

This guide will help you set up Supabase for the HeadZ hair transformation app to enable image caching functionality.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `headz-hair-app` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose the closest to your users
5. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon public key** (under "Project API keys")

## Step 3: Update Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=your_actual_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

## Step 4: Create the Database Table

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `src/database/schema.sql`
3. Click "Run" to execute the SQL

This will create:
- `generated_images` table for storing cached images
- Indexes for fast lookups
- Row Level Security policies
- Automatic timestamp updates

## Step 5: Create Storage Bucket (Important!)

**Why needed:** OpenAI image URLs expire after 1 hour. We need permanent storage.

1. In your Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Enter bucket details:
   - **Name**: `generated-images`
   - **Public bucket**: ✅ **Enable** (so images can be accessed via URL)
   - **File size limit**: 50MB (optional)
   - **Allowed MIME types**: `image/png,image/jpeg` (optional)
4. Click **"Create bucket"**

### Set Bucket Policies

1. In the Storage section, click on your `generated-images` bucket
2. Go to **"Policies"** tab
3. Click **"New policy"**
4. Choose **"For full customization"**
5. Add this policy:

```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'generated-images');

CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'generated-images');
```

This allows:
- ✅ Anyone to read/view images (public access)
- ✅ Your app to upload new images

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Upload an image and generate a hairstyle
3. Try the same combination again - it should load from cache instantly!

## How It Works

### Caching Logic
1. **Unique Hash Generation**: Each combination of (original image + hairstyle + color) gets a unique SHA-256 hash
2. **Cache Check**: Before generating, the app checks if this combination exists in Supabase
3. **Instant Retrieval**: If found, the cached image is returned immediately
4. **New Generation**: If not found, a new image is generated and stored in cache

### Database Schema
- `unique_hash`: SHA-256 hash of the combination (primary lookup key)
- `original_image_hash`: Hash of just the uploaded image
- `hairstyle`: Normalized hairstyle name
- `hair_color`: Normalized hex color code
- `generated_image_url`: URL of the generated image
- `created_at` / `updated_at`: Timestamps

### Benefits
- **Faster Response**: Cached images load instantly
- **Cost Savings**: Reduces OpenAI API calls for duplicate requests
- **Consistent Results**: Same input always returns the same output
- **Better UX**: Users get immediate feedback for repeated combinations
- **Permanent Storage**: Images never expire (unlike OpenAI URLs that expire in 1 hour)
- **Reliable Access**: Images remain accessible indefinitely

## Security Notes

- Row Level Security (RLS) is enabled
- Current policy allows all operations (you may want to restrict this in production)
- API keys are stored in environment variables (never commit them to git)

## Troubleshooting

### Common Issues

1. **"Error checking cached image"**
   - Check your Supabase URL and API key
   - Ensure the table was created successfully

2. **"Failed to cache generated image"**
   - Check your database permissions
   - Verify the table schema matches the expected structure

3. **Images not loading from cache**
   - Check browser console for errors
   - Verify the unique hash generation is working

### Debug Mode

To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('debug', 'supabase:*');
```

## Production Considerations

1. **Storage**: Consider using Supabase Storage for hosting generated images
2. **Cleanup**: Implement a cleanup job for old cached images
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **Monitoring**: Set up monitoring for cache hit rates and performance
