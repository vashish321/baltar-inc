/*
  Warnings:

  - You are about to drop the column `orderMonth` on the `subscription_orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId]` on the table `subscription_orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "subscription_orders" DROP COLUMN "orderMonth";

-- CreateIndex
CREATE UNIQUE INDEX "subscription_orders_subscriptionId_key" ON "subscription_orders"("subscriptionId");
