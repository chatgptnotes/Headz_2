import { supabase } from '../lib/supabase.js';

/**
 * Test Supabase connection and table access
 * Call this function from browser console to test setup
 */
export const testSupabaseConnection = async () => {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('generated_images')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Current cached images: ${data || 0}`);
    
    // Test 2: Insert a test record
    const testRecord = {
      unique_hash: 'test_hash_' + Date.now(),
      original_image_hash: 'test_original_hash',
      hairstyle: 'test_style',
      hair_color: 'ff0000',
      generated_image_url: 'https://example.com/test.jpg'
    };
    
    const { error: insertError } = await supabase
      .from('generated_images')
      .insert(testRecord);
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      return false;
    }
    
    console.log('✅ Insert test successful!');
    
    // Test 3: Query the test record
    const { data: queryData, error: queryError } = await supabase
      .from('generated_images')
      .select('*')
      .eq('unique_hash', testRecord.unique_hash)
      .single();
    
    if (queryError) {
      console.error('❌ Query test failed:', queryError);
      return false;
    }
    
    console.log('✅ Query test successful!');
    console.log('📄 Retrieved record:', queryData);
    
    // Test 4: Delete the test record
    const { error: deleteError } = await supabase
      .from('generated_images')
      .delete()
      .eq('unique_hash', testRecord.unique_hash);
    
    if (deleteError) {
      console.error('❌ Delete test failed:', deleteError);
      return false;
    }
    
    console.log('✅ Delete test successful!');
    console.log('🎉 All tests passed! Supabase is properly configured.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection;
}
