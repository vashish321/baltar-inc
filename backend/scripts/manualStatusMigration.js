const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function manualStatusMigration() {
  try {
    console.log('🔄 Starting manual status migration...');

    // Step 1: Add new enum values to the database
    console.log('📝 Step 1: Adding new enum values...');
    
    try {
      await prisma.$executeRaw`
        ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'PAID';
      `;
      console.log('✅ Added PAID status');
    } catch (error) {
      console.log('⚠️ PAID status may already exist');
    }

    try {
      await prisma.$executeRaw`
        ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'FAILED';
      `;
      console.log('✅ Added FAILED status');
    } catch (error) {
      console.log('⚠️ FAILED status may already exist');
    }

    try {
      await prisma.$executeRaw`
        ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'COMPLIMENTARY';
      `;
      console.log('✅ Added COMPLIMENTARY status');
    } catch (error) {
      console.log('⚠️ COMPLIMENTARY status may already exist');
    }

    // Step 2: Migrate existing data
    console.log('\n📝 Step 2: Migrating existing subscription data...');
    
    const subscriptions = await prisma.customerSubscription.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true
      }
    });

    console.log(`📋 Found ${subscriptions.length} subscriptions to migrate`);

    for (const subscription of subscriptions) {
      let newStatus = subscription.status;

      // Determine new status based on current status
      if (subscription.status === 'ACTIVE') {
        // If subscription was active, assume payment was successful
        newStatus = 'PAID';
      } else if (subscription.status === 'PAUSED') {
        // If subscription was paused, assume payment was successful but paused for other reasons
        newStatus = 'PAID';
      } else if (subscription.status === 'CANCELLED') {
        newStatus = 'CANCELLED';
      } else {
        // Keep PENDING as is for now
        newStatus = 'PENDING';
      }

      if (newStatus !== subscription.status) {
        console.log(`🔄 Updating ${subscription.fullName} (${subscription.email})`);
        console.log(`   ${subscription.status} → ${newStatus}`);

        await prisma.customerSubscription.update({
          where: { id: subscription.id },
          data: { status: newStatus }
        });
      } else {
        console.log(`✅ ${subscription.fullName} (${subscription.email}) - no change needed`);
      }
    }

    // Step 3: Show final status
    console.log('\n📊 Final status distribution:');
    const statusCounts = await prisma.customerSubscription.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    statusCounts.forEach(({ status, _count }) => {
      console.log(`   ${status}: ${_count.status} subscriptions`);
    });

    console.log('\n✅ Manual migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Remove paymentStatus field from schema');
    console.log('   2. Remove old enum values (ACTIVE, PAUSED)');
    console.log('   3. Update application code to use new status values');

  } catch (error) {
    console.error('❌ Manual migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  manualStatusMigration()
    .then(() => {
      console.log('✅ Manual migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Manual migration failed:', error);
      process.exit(1);
    });
}

module.exports = { manualStatusMigration };
