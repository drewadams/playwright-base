import { Page, User } from "./types";

import type { Database as DB } from "better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

let db: DB | null = null;

export const openDb = (): DB => {
  if (!db) {
    const dbPath = path.resolve(__dirname, "../../../playwright.db");
    db = new Database(dbPath, { verbose: console.log });
    if (!db.open) {
      console.error("Could not open database.");
      throw new Error("Could not open database.");
    }
  }
  return db;
};

export const getDb = (): DB => {
  if (!db) {
    db = openDb();
  }
  if (!db.open) {
    console.error("Could not get database.");
    throw new Error("Could not get database.");
  }
  return db;
};

export const closeDb = () => {
  const db = getDb();
  db.close();
  if (db.open) {
    console.error("Could not close database.");
    throw new Error("Could not close database.");
  }
  console.log("Database closed.");
  return;
};

export const getRandomUser = (): User => {
  try {
    const db = getDb();
    const statement = db.prepare(
      "SELECT * FROM users ORDER BY RANDOM() LIMIT 1",
    );
    const user = statement.get() as User;
    if (!user || !user.email) {
      throw new Error("Could not retrieve user or user email is missing.");
    }
    return user as User;
  } catch (err) {
    console.error("Error retrieving random user:", err);
    throw new Error("Could not retrieve random user.");
  }
};

export const getAllPages = () => {
  try {
    const db = getDb();
    const statement = db.prepare("SELECT * FROM pages");
    const pages = statement.all() as Page[];
    if (!pages || pages.length === 0) {
      throw new Error("Could not retrieve pages or pages are empty.");
    }
    return pages;
  } catch (err) {
    console.error("Could not retrieve pages:", err);
    throw new Error("Could not retrieve pages.");
  }
};
