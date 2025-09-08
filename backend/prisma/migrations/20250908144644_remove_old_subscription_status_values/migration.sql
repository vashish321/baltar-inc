/*
  Warnings:

  - The values [ACTIVE,PAUSED] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paymentStatus` on the `customer_subscriptions` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('PENDING', 'PAID', 'FAILED', 'COMPLIMENTARY', 'CANCELLED');
ALTER TABLE "customer_subscriptions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "customer_subscriptions" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
ALTER TABLE "customer_subscriptions" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "customer_subscriptions" DROP COLUMN "paymentStatus";
