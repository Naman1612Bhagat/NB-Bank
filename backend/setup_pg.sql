-- PostgreSQL Setup Script for NB Bank
-- Run this in your PostgreSQL database (e.g., Neon or local)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Accounts Table
CREATE TABLE IF NOT EXISTS Accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    account_type VARCHAR(20) CHECK (account_type IN ('Savings', 'Current')) NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Transactions Table
CREATE TABLE IF NOT EXISTS Transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES Accounts(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('Deposit', 'Withdraw', 'Transfer')) NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    description VARCHAR(255),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Feedbacks Table
CREATE TABLE IF NOT EXISTS Feedbacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
