const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🚀 Starting API Tests...\n');

  try {
    // Test 1: Create Frontend Web Design Booking
    console.log('1. Testing Frontend Web Design Booking Creation...');
    const frontendBooking = await axios.post(`${BASE_URL}/bookings`, {
      email: 'alice@example.com',
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '555-9999',
      serviceType: 'FRONTEND_WEB_DESIGN',
      projectTitle: 'E-commerce Website',
      projectDescription: 'Online store for handmade crafts',
      estimatedBudget: 3500
    });
    console.log('✅ Frontend booking created successfully');
    const frontendProjectId = frontendBooking.data.project.id;

    // Test 2: Create Savour & Sip Booking
    console.log('\n2. Testing Savour & Sip Booking Creation...');
    const savourBooking = await axios.post(`${BASE_URL}/bookings`, {
      email: 'bob@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      phone: '555-8888',
      serviceType: 'SAVOUR_AND_SIP',
      eventDate: '2025-08-20',
      eventLocation: 'Mississauga Convention Center',
      guestCount: 120,
      services: ['catering', 'bartending', 'servers', 'setup'],
      specialRequests: 'Gluten-free options needed',
      projectTitle: 'Annual Company Gala',
      estimatedBudget: 5000
    });
    console.log('✅ Savour & Sip booking created successfully');
    const savourProjectId = savourBooking.data.project.id;

    // Test 3: Auto-generate invoices
    console.log('\n3. Testing Auto Invoice Generation...');
    const frontendInvoice = await axios.post(`${BASE_URL}/invoices/auto-generate/${frontendProjectId}`);
    const savourInvoice = await axios.post(`${BASE_URL}/invoices/auto-generate/${savourProjectId}`);
    console.log('✅ Both invoices generated successfully');

    // Test 4: Update project status
    console.log('\n4. Testing Project Status Update...');
    await axios.patch(`${BASE_URL}/projects/${frontendProjectId}/status`, {
      status: 'IN_PROGRESS'
    });
    await axios.patch(`${BASE_URL}/projects/${savourProjectId}/status`, {
      status: 'APPROVED'
    });
    console.log('✅ Project statuses updated successfully');

    // Test 5: Record payment
    console.log('\n5. Testing Payment Recording...');
    await axios.post(`${BASE_URL}/invoices/${frontendInvoice.data.invoice.id}/payment`, {
      amount: 1000,
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-PARTIAL-001'
    });
    console.log('✅ Payment recorded successfully');

    // Test 6: Get dashboard data
    console.log('\n6. Testing Dashboard Data Retrieval...');
    const [bookings, projects, invoices, clients] = await Promise.all([
      axios.get(`${BASE_URL}/bookings`),
      axios.get(`${BASE_URL}/projects`),
      axios.get(`${BASE_URL}/invoices`),
      axios.get(`${BASE_URL}/clients`)
    ]);

    console.log(`✅ Dashboard data retrieved:`);
    console.log(`   - Bookings: ${bookings.data.bookings.length}`);
    console.log(`   - Projects: ${projects.data.projects.length}`);
    console.log(`   - Invoices: ${invoices.data.invoices.length}`);
    console.log(`   - Clients: ${clients.data.clients.length}`);

    // Test 7: Get client dashboard
    console.log('\n7. Testing Client Dashboard...');
    const clientId = frontendBooking.data.client.id;
    const clientDashboard = await axios.get(`${BASE_URL}/clients/${clientId}/dashboard`);
    console.log('✅ Client dashboard data retrieved successfully');

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total Clients: ${clients.data.clients.length}`);
    console.log(`   - Total Projects: ${projects.data.projects.length}`);
    console.log(`   - Total Invoices: ${invoices.data.invoices.length}`);
    console.log(`   - Total Bookings: ${bookings.data.bookings.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
