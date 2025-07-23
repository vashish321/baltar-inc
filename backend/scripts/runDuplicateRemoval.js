#!/usr/bin/env node

/**
 * Script to remove duplicate articles from Consumer Pulse database
 * 
 * Usage:
 *   node backend/scripts/runDuplicateRemoval.js
 * 
 * This script will:
 * 1. Find and remove exact duplicates (same title or URL)
 * 2. Find and remove similar articles using fuzzy matching
 * 3. Provide detailed statistics about the cleanup process
 */

const DuplicateRemover = require('./removeDuplicates');

async function main() {
  console.log('🧹 Consumer Pulse - Duplicate Article Removal Tool');
  console.log('================================================\n');

  // Confirm before proceeding
  console.log('⚠️  WARNING: This will permanently delete duplicate articles from the database!');
  console.log('📋 The script will:');
  console.log('   1. Remove articles with identical titles (case-insensitive)');
  console.log('   2. Remove articles with identical source URLs');
  console.log('   3. Remove articles with >70% title similarity');
  console.log('   4. Remove articles with >80% content similarity');
  console.log('   5. Always keep the oldest article when duplicates are found\n');

  // In a production environment, you might want to add a confirmation prompt
  // For now, we'll proceed automatically
  console.log('🚀 Starting duplicate removal in 3 seconds...\n');
  
  // Small delay to allow reading the warning
  await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    const remover = new DuplicateRemover();
    await remover.removeDuplicates();
    
    console.log('\n🎉 Duplicate removal completed successfully!');
    console.log('💡 Tip: Run this script periodically to keep your database clean.');
    
  } catch (error) {
    console.error('\n❌ Error during duplicate removal:', error.message);
    console.error('🔧 Please check your database connection and try again.');
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n⚠️  Process interrupted by user. Exiting...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Process terminated. Exiting...');
  process.exit(0);
});

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
