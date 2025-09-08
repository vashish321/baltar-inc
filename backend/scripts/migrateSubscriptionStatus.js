const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateSubscriptionStatus() {
  try {
    console.log('🔄 Starting subscription status migration...');

    // Get all existing subscriptions
    const subscriptions = await prisma.customerSubscription.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
        paymentStatus: true
      }
    });

    console.log(`📋 Found ${subscriptions.length} subscriptions to migrate`);

    if (subscriptions.length === 0) {
      console.log('✅ No subscriptions to migrate');
      return;
    }

    // Create mapping logic for status consolidation
    const getConsolidatedStatus = (currentStatus, paymentStatus) => {
      // If payment is completed, subscription should be PAID
      if (paymentStatus === 'COMPLETED' || paymentStatus === 'PAID') {
        return 'PAID';
      }
      
      // If payment failed, subscription should be FAILED
      if (paymentStatus === 'FAILED') {
        return 'FAILED';
      }
      
      // If subscription is cancelled, keep it cancelled
      if (currentStatus === 'CANCELLED') {
        return 'CANCELLED';
      }
      
      // If subscription was active but payment is pending, mark as PAID (assume it was working)
      if (currentStatus === 'ACTIVE') {
        return 'PAID';
      }
      
      // If subscription was paused, mark as PAID (assume payment was made but paused for other reasons)
      if (currentStatus === 'PAUSED') {
        return 'PAID';
      }
      
      // Default to PENDING for any other cases
      return 'PENDING';
    };

    // Process each subscription
    for (const subscription of subscriptions) {
      const newStatus = getConsolidatedStatus(subscription.status, subscription.paymentStatus);
      
      console.log(`🔄 Migrating ${subscription.fullName} (${subscription.email})`);
      console.log(`   Old: status=${subscription.status}, paymentStatus=${subscription.paymentStatus}`);
      console.log(`   New: status=${newStatus}`);
      
      // Update the subscription with the new consolidated status
      await prisma.$executeRaw`
        UPDATE "customer_subscriptions" 
        SET "status" = ${newStatus}::text::"SubscriptionStatus"
        WHERE "id" = ${subscription.id}
      `;
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    
    // Get final status counts
    const statusCounts = await prisma.customerSubscription.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    statusCounts.forEach(({ status, _count }) => {
      console.log(`   ${status}: ${_count.status} subscriptions`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  migrateSubscriptionStatus()
    .then(() => {
      console.log('✅ Data migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Data migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateSubscriptionStatus };
