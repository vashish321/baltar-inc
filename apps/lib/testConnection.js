// Test connection to backend
export const testBackendConnection = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://baltar-inc-1.onrender.com';
  
  console.log('🔍 Testing backend connection...');
  console.log('📍 API URL:', apiUrl);
  console.log('🌍 Environment:', process.env.NEXT_PUBLIC_ENVIRONMENT);
  
  try {
    // Test basic health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${apiUrl}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status, healthResponse.statusText);
    }
    
    // Test root endpoint
    console.log('2️⃣ Testing root endpoint...');
    const rootResponse = await fetch(`${apiUrl}/`);
    
    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      console.log('✅ Root endpoint passed:', rootData);
    } else {
      console.log('❌ Root endpoint failed:', rootResponse.status, rootResponse.statusText);
    }
    
    // Test auth endpoint (should fail without credentials, but should not give network error)
    console.log('3️⃣ Testing auth endpoint...');
    const authResponse = await fetch(`${apiUrl}/api/auth/verify`);
    
    if (authResponse.status === 401) {
      console.log('✅ Auth endpoint reachable (401 expected without token)');
    } else if (authResponse.ok) {
      console.log('✅ Auth endpoint passed:', await authResponse.json());
    } else {
      console.log('❌ Auth endpoint failed:', authResponse.status, authResponse.statusText);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.error('🔧 Possible issues:');
    console.error('   - Backend not running');
    console.error('   - CORS not configured properly');
    console.error('   - Wrong URL or port');
    console.error('   - Network/firewall issues');
    return false;
  }
};

// Test function for browser console
if (typeof window !== 'undefined') {
  window.testBackendConnection = testBackendConnection;
}
