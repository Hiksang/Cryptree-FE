import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  bigint,
  numeric,
  jsonb,
  unique,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  authId: text("auth_id").primaryKey(),
  address: text("address"),
  name: text("name"),
  tier: text("tier").default("bronze"),
  referralCode: text("referral_code").unique(),
  taxCountry: text("tax_country").default("kr"),
  taxMethod: text("tax_method").default("fifo"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId, { onDelete: "cascade" }),
  address: text("address").notNull(),
  label: text("label").default(""),
  isPrimary: boolean("is_primary").default(false),
  lastScannedBlock: jsonb("last_scanned_block").default({}),
  lastScannedAt: timestamp("last_scanned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  unique("wallets_user_address_uniq").on(table.userId, table.address),
]);

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId, { onDelete: "cascade" }),
  chainId: text("chain_id").notNull(),
  hash: text("hash").notNull(),
  blockNumber: bigint("block_number", { mode: "number" }),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  protocol: text("protocol"),
  type: text("type").notNull(),
  typeLabel: text("type_label"),
  fromToken: text("from_token"),
  toToken: text("to_token"),
  amount: numeric("amount").notNull().default("0"),
  fee: numeric("fee").default("0"),
  status: text("status").notNull().default("completed"),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const scanJobs = pgTable("scan_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  chainId: text("chain_id").notNull(),
  status: text("status").notNull().default("pending"),
  scanType: text("scan_type").notNull().default("full"),
  fromBlock: bigint("from_block", { mode: "number" }).default(0),
  toBlock: bigint("to_block", { mode: "number" }),
  txCount: integer("tx_count").default(0),
  error: text("error"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const pointBalances = pgTable("point_balances", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.authId, { onDelete: "cascade" }),
  balance: integer("balance").notNull().default(0),
  lifetimeEarned: integer("lifetime_earned").notNull().default(0),
  lifetimeSpent: integer("lifetime_spent").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  check("balance_non_negative", sql`${table.balance} >= 0`),
]);

export const pointLedger = pgTable("point_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  referenceId: text("reference_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const shopProducts = pgTable("shop_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  category: text("category").notNull(),
  pointsCost: integer("points_cost").notNull(),
  stock: integer("stock"),
  tag: text("tag"),
  badgeLabel: text("badge_label"),
  badgeLabelEn: text("badge_label_en"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const exchangeHistory = pgTable("exchange_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.authId, { onDelete: "cascade" }),
  type: text("type").notNull(),
  productId: uuid("product_id").references(() => shopProducts.id),
  pointsSpent: integer("points_spent").notNull(),
  received: text("received").notNull(),
  status: text("status").notNull().default("processing"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: text("referrer_id")
    .notNull()
    .references(() => users.authId, { onDelete: "cascade" }),
  referredId: text("referred_id")
    .notNull()
    .references(() => users.authId, { onDelete: "cascade" }),
  bonusAwarded: integer("bonus_awarded").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
}, (table) => [
  unique("referrals_pair_uniq").on(table.referrerId, table.referredId),
]);
