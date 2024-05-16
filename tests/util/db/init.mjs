import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "../../../playwright.db");

const getRandomIndex = (arr) => {
  return Math.floor(Math.random() * arr.length);
};

const generateRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateUser = () => {
  const names = [
    "John",
    "Jane",
    "Will",
    "Mark",
    "Drew",
    "Sara",
    "Megan",
    "Wendy",
    "Tom",
    "Jerry",
  ];
  const lastNames = [
    "Doe",
    "Smith",
    "Johnson",
    "Brown",
    "Williams",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
  ];
  const emails = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  const roles = ["admin", "user"];
  const user = {
    first_name: names[getRandomIndex(names)],
    last_name: lastNames[getRandomIndex(lastNames)],
    get email() {
      return `${this.first_name}.${this.last_name}-${generateRandomInt(0, 10)}@${emails[getRandomIndex(emails)]}`;
    },
    password: "password",
    created_at: new Date().toISOString(),
    phone: `+1${generateRandomInt(1000000000, 9999999999)}`,
    role: roles[getRandomIndex(roles)],
  };
  return user;
};

const seedUsers = (db) => {
  try {
    const insertUser = db.prepare(
      `INSERT INTO users (first_name, last_name, email, password, created_at, phone, role) VALUES (@first_name, @last_name, @email, @password, @created_at, @phone, @role)`,
    );

    // Add users
    db.transaction(() => {
      for (let i = 0; i < 15; i++) {
        const user = generateUser();
        insertUser.run(user);
      }
    })([]);

    console.log("seeded users");
  } catch (err) {
    console.error("Error inserting user:", err);
  }
};

const seedPages = (db) => {
  try {
    const pages = [
      { url: "/", title: "Home" },
      { url: "/about", title: "About" },
      { url: "/contact", title: "Contact" },
    ];
    const insertPages = db.transaction((pages) => {
      const insertStatement = db.prepare(
        `INSERT INTO pages (url, title) VALUES (@url, @title)`,
      );
      for (const page of pages) {
        insertStatement.run(page);
      }
    });
    insertPages(pages);
    console.log("seeded pages");
  } catch (err) {
    console.error("Error inserting page:", err);
    throw err;
  }
};

const init = () => {
  const db = new Database(dbPath, {
    verbose: console.log,
    pragma: "journal_mode = WAL",
  });
  if (!db.open) {
    throw new Error("Failed to open database");
  }
  try {
    db.prepare("DROP TABLE IF EXISTS users;").run();
    db.prepare("DROP TABLE IF EXISTS pages;").run();
    db.prepare(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY UNIQUE, first_name TEXT, last_name TEXT, email TEXT UNIQUE, password TEXT, created_at TEXT, phone TEXT, role TEXT)",
    ).run();
    db.prepare(
      "CREATE TABLE IF NOT EXISTS pages (id INTEGER PRIMARY KEY UNIQUE, url TEXT UNIQUE, title TEXT)",
    ).run();
    console.log("created db");
  } catch (err) {
    console.error("Error initializing db:", err);
    throw err;
  }

  seedUsers(db);
  seedPages(db);
  return;
};

init();
