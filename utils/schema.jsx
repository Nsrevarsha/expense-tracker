import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon").default("💰"), // Add default icon
  createdBy: varchar("createdBy").notNull(),
  category: varchar("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Add creation timestamp
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id).notNull(),
  category: varchar("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Add creation timestamp
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
