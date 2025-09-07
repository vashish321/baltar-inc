const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

// Test configuration
const BASE_URL = 'http://localhost:5001';
const ADMIN_EMAIL = 'BaltarInc@admin.com';
const ADMIN_PASSWORD = 'Click@123';

let adminToken = null;

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
    }
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();
  
  return { response, data, status: response.status };
}

// Test functions
async function testAdminLogin() {
  console.log('\n🔐 Testing Admin Login...');
  
  try {
    const { data, status } = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      })
    });

    if (status === 200 && data.success) {
      adminToken = data.token;
      console.log('✅ Admin login successful');
      return true;
    } else {
      console.log('❌ Admin login failed:', data.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
    return false;
  }
}

async function testPublicEndpoints() {
  console.log('\n📦 Testing Public Endpoints...');
  
  // Test packages endpoint
  console.log('  Testing packages endpoint...');
  const { data: packagesData, status: packagesStatus } = await makeRequest('/api/le-mode-co/packages');
  
  if (packagesStatus === 200 && packagesData.success) {
    console.log(`  ✅ Packages: Found ${packagesData.packages.length} packages`);
    packagesData.packages.forEach(pkg => {
      console.log(`    - ${pkg.name}: $${pkg.price}/month ${pkg.isPopular ? '(Popular)' : ''}`);
    });
  } else {
    console.log('  ❌ Packages endpoint failed');
  }

  // Test categories endpoint
  console.log('  Testing categories endpoint...');
  const { data: categoriesData, status: categoriesStatus } = await makeRequest('/api/le-mode-co/lookbook/categories');
  
  if (categoriesStatus === 200 && categoriesData.success) {
    console.log(`  ✅ Categories: Found ${categoriesData.categories.length} categories`);
    categoriesData.categories.forEach(cat => {
      console.log(`    - ${cat.name}: ${cat.description}`);
    });
  } else {
    console.log('  ❌ Categories endpoint failed');
  }

  // Test products endpoint for each category
  console.log('  Testing products endpoint...');
  if (categoriesData.success) {
    for (const category of categoriesData.categories.slice(0, 3)) { // Test first 3 categories
      const { data: productsData, status: productsStatus } = await makeRequest(
        `/api/le-mode-co/lookbook/products?category=${category.name}`
      );
      
      if (productsStatus === 200 && productsData.success) {
        console.log(`    ✅ ${category.name}: Found ${productsData.products.length} products`);
      } else {
        console.log(`    ❌ ${category.name}: Products endpoint failed`);
      }
    }
  }
}

async function testSubscriptionFlow() {
  console.log('\n👤 Testing Subscription Flow...');
  
  // First get packages to use in subscription
  const { data: packagesData } = await makeRequest('/api/le-mode-co/packages');
  if (!packagesData.success || packagesData.packages.length === 0) {
    console.log('❌ No packages available for subscription test');
    return null;
  }

  const testPackage = packagesData.packages[0];
  console.log(`  Using package: ${testPackage.name} ($${testPackage.price})`);

  // Test subscription creation
  const subscriptionData = {
    email: `test.customer.${Date.now()}@example.com`,
    fullName: 'Test Customer',
    phone: '+1234567890',
    zipCode: '12345',
    address: '123 Test Street, Test City, TC 12345',
    packageId: testPackage.id
  };

  console.log('  Creating subscription...');
  const { data: subData, status: subStatus } = await makeRequest('/api/le-mode-co/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionData)
  });

  if (subStatus === 201 && subData.success) {
    console.log('  ✅ Subscription created successfully');
    console.log(`    - ID: ${subData.subscription.id}`);
    console.log(`    - Email: ${subData.subscription.email}`);
    console.log(`    - Status: ${subData.subscription.status}`);
    return subData.subscription;
  } else {
    console.log('  ❌ Subscription creation failed:', subData.error);
    return null;
  }
}

async function testAdminDashboard() {
  console.log('\n📊 Testing Admin Dashboard...');
  
  if (!adminToken) {
    console.log('❌ No admin token available');
    return;
  }

  // Test dashboard stats
  console.log('  Testing dashboard stats...');
  const { data: statsData, status: statsStatus } = await makeRequest('/api/le-mode-co/admin/dashboard-stats');
  
  if (statsStatus === 200 && statsData.success) {
    console.log('  ✅ Dashboard stats retrieved');
    console.log(`    - Total Subscriptions: ${statsData.stats.totalSubscriptions}`);
    console.log(`    - Active Subscriptions: ${statsData.stats.activeSubscriptions}`);
    console.log(`    - Pending Orders: ${statsData.stats.pendingOrders}`);
    console.log(`    - Total Revenue: $${statsData.stats.monthlyRevenue}`);
  } else {
    console.log('  ❌ Dashboard stats failed');
  }

  // Test subscriptions list
  console.log('  Testing subscriptions list...');
  const { data: subsData, status: subsStatus } = await makeRequest('/api/le-mode-co/admin/subscriptions');
  
  if (subsStatus === 200 && subsData.success) {
    console.log(`  ✅ Subscriptions list: Found ${subsData.subscriptions.length} subscriptions`);
    subsData.subscriptions.forEach((sub, index) => {
      console.log(`    ${index + 1}. ${sub.fullName} (${sub.email}) - ${sub.status}`);
    });
  } else {
    console.log('  ❌ Subscriptions list failed');
  }
}

async function testCategoryManagement() {
  console.log('\n🏷️ Testing Category Management...');
  
  if (!adminToken) {
    console.log('❌ No admin token available');
    return;
  }

  // Test getting all categories
  console.log('  Testing get all categories...');
  const { data: categoriesData, status: categoriesStatus } = await makeRequest('/api/le-mode-co/admin/categories');
  
  if (categoriesStatus === 200 && categoriesData.success) {
    console.log(`  ✅ Categories retrieved: ${categoriesData.categories.length} categories`);
  } else {
    console.log('  ❌ Get categories failed');
    return;
  }

  // Test creating a new category
  console.log('  Testing create category...');
  const newCategory = {
    name: `TEST_CATEGORY_${Date.now()}`,
    description: 'Test category for automated testing',
    displayOrder: 999
  };

  const { data: createData, status: createStatus } = await makeRequest('/api/le-mode-co/admin/categories', {
    method: 'POST',
    body: JSON.stringify(newCategory)
  });

  if (createStatus === 200 && createData.success) {
    console.log('  ✅ Category created successfully');
    const categoryId = createData.category.id;

    // Test updating the category
    console.log('  Testing update category...');
    const updateData = {
      description: 'Updated test category description',
      isActive: false
    };

    const { data: updateResult, status: updateStatus } = await makeRequest(`/api/le-mode-co/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (updateStatus === 200 && updateResult.success) {
      console.log('  ✅ Category updated successfully');
    } else {
      console.log('  ❌ Category update failed');
    }

    // Test deleting the category
    console.log('  Testing delete category...');
    const { data: deleteResult, status: deleteStatus } = await makeRequest(`/api/le-mode-co/admin/categories/${categoryId}`, {
      method: 'DELETE'
    });

    if (deleteStatus === 200 && deleteResult.success) {
      console.log('  ✅ Category deleted successfully');
    } else {
      console.log('  ❌ Category deletion failed');
    }
  } else {
    console.log('  ❌ Category creation failed');
  }
}

async function testEdgeCases() {
  console.log('\n⚠️ Testing Edge Cases...');

  // Test invalid category in products endpoint
  console.log('  Testing invalid category...');
  const { data: invalidCatData, status: invalidCatStatus } = await makeRequest('/api/le-mode-co/lookbook/products?category=INVALID_CATEGORY');

  if (invalidCatStatus === 200 && invalidCatData.success) {
    console.log(`  ✅ Invalid category handled gracefully: ${invalidCatData.products.length} products`);
  } else {
    console.log('  ❌ Invalid category not handled properly');
  }

  // Test subscription with missing fields
  console.log('  Testing incomplete subscription...');
  const incompleteData = {
    email: 'incomplete@test.com',
    fullName: 'Incomplete User'
    // Missing required fields
  };

  const { data: incompleteResult, status: incompleteStatus } = await makeRequest('/api/le-mode-co/subscribe', {
    method: 'POST',
    body: JSON.stringify(incompleteData)
  });

  if (incompleteStatus === 400) {
    console.log('  ✅ Incomplete subscription properly rejected');
  } else {
    console.log('  ❌ Incomplete subscription not properly validated');
  }

  // Test duplicate subscription
  console.log('  Testing duplicate subscription...');
  const duplicateEmail = `duplicate.${Date.now()}@test.com`;
  const { data: packagesData } = await makeRequest('/api/le-mode-co/packages');

  if (packagesData.success && packagesData.packages.length > 0) {
    const validSubscription = {
      email: duplicateEmail,
      fullName: 'Duplicate Test',
      phone: '+1234567890',
      zipCode: '12345',
      address: '123 Test Street',
      packageId: packagesData.packages[0].id
    };

    // Create first subscription
    await makeRequest('/api/le-mode-co/subscribe', {
      method: 'POST',
      body: JSON.stringify(validSubscription)
    });

    // Try to create duplicate
    const { data: duplicateResult, status: duplicateStatus } = await makeRequest('/api/le-mode-co/subscribe', {
      method: 'POST',
      body: JSON.stringify(validSubscription)
    });

    if (duplicateStatus === 400) {
      console.log('  ✅ Duplicate subscription properly rejected');
    } else {
      console.log('  ❌ Duplicate subscription not properly handled');
    }
  }

  // Test unauthorized admin access
  console.log('  Testing unauthorized admin access...');
  const originalToken = adminToken;
  adminToken = 'invalid-token';

  const { data: unauthorizedData, status: unauthorizedStatus } = await makeRequest('/api/le-mode-co/admin/subscriptions');

  if (unauthorizedStatus === 401) {
    console.log('  ✅ Unauthorized access properly blocked');
  } else {
    console.log('  ❌ Unauthorized access not properly handled');
  }

  adminToken = originalToken; // Restore valid token

  // Test invalid package ID in subscription
  console.log('  Testing invalid package ID...');
  const invalidPackageData = {
    email: `invalid.package.${Date.now()}@test.com`,
    fullName: 'Invalid Package Test',
    phone: '+1234567890',
    zipCode: '12345',
    address: '123 Test Street',
    packageId: 'invalid-package-id'
  };

  const { data: invalidPackageResult, status: invalidPackageStatus } = await makeRequest('/api/le-mode-co/subscribe', {
    method: 'POST',
    body: JSON.stringify(invalidPackageData)
  });

  if (invalidPackageStatus === 400 || invalidPackageStatus === 500) {
    console.log('  ✅ Invalid package ID properly rejected');
  } else {
    console.log('  ❌ Invalid package ID not properly handled');
  }
}

// Main test runner
async function runComprehensiveTests() {
  console.log('🚀 Starting Le Mode Co Comprehensive Testing...');
  console.log('='.repeat(50));

  try {
    // Test admin login first
    const loginSuccess = await testAdminLogin();
    
    // Test public endpoints
    await testPublicEndpoints();
    
    // Test subscription flow
    const subscription = await testSubscriptionFlow();
    
    // Test admin features (if login successful)
    if (loginSuccess) {
      await testAdminDashboard();
      await testCategoryManagement();
    }
    
    // Test edge cases
    await testEdgeCases();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Le Mode Co Testing Complete!');
    
  } catch (error) {
    console.error('❌ Testing failed with error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runComprehensiveTests()
    .then(() => {
      console.log('✅ All tests completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { runComprehensiveTests };
