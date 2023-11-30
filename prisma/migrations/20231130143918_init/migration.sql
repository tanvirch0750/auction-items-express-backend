/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('ongoing', 'notStarted', 'end');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('paid', 'notPaid');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT,
    "categoryImage" TEXT,

    CONSTRAINT "productCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "auctionDate" TEXT NOT NULL,
    "auctionTime" TEXT NOT NULL,
    "auctionStatus" "AuctionStatus" NOT NULL,
    "initialBiddingPrice" DOUBLE PRECISION NOT NULL,
    "currentBiddingPrice" DOUBLE PRECISION NOT NULL,
    "incrementAmount" DOUBLE PRECISION NOT NULL,
    "bidApprove" BOOLEAN DEFAULT false,
    "productReceive" BOOLEAN DEFAULT false,
    "productOwnerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "winnigPrice" DOUBLE PRECISION,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctionWinners" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "auctionWinnerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "auctionWinners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'notPaid',
    "transactionId" TEXT,
    "productReceived" BOOLEAN NOT NULL DEFAULT false,
    "auctionWinnerId" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auctionBiddingHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "bidderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "auctionBiddingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productMessages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "productMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "productCategory_categoryName_key" ON "productCategory"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "auctionWinners_productId_key" ON "auctionWinners"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_auctionWinnerId_key" ON "payment"("auctionWinnerId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productOwnerId_fkey" FOREIGN KEY ("productOwnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "productCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctionWinners" ADD CONSTRAINT "auctionWinners_auctionWinnerId_fkey" FOREIGN KEY ("auctionWinnerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctionWinners" ADD CONSTRAINT "auctionWinners_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_auctionWinnerId_fkey" FOREIGN KEY ("auctionWinnerId") REFERENCES "auctionWinners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctionBiddingHistory" ADD CONSTRAINT "auctionBiddingHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctionBiddingHistory" ADD CONSTRAINT "auctionBiddingHistory_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productMessages" ADD CONSTRAINT "productMessages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productMessages" ADD CONSTRAINT "productMessages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
