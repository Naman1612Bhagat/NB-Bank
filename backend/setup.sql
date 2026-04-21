-- Drop existing objects if needed (optional)
-- BEGIN
--    EXECUTE IMMEDIATE 'DROP TABLE Transactions CASCADE CONSTRAINTS';
--    EXECUTE IMMEDIATE 'DROP TABLE Accounts CASCADE CONSTRAINTS';
--    EXECUTE IMMEDIATE 'DROP TABLE Users CASCADE CONSTRAINTS';
--    EXECUTE IMMEDIATE 'DROP SEQUENCE users_seq';
--    EXECUTE IMMEDIATE 'DROP SEQUENCE accounts_seq';
--    EXECUTE IMMEDIATE 'DROP SEQUENCE transactions_seq';
-- EXCEPTION
--    WHEN OTHERS THEN
--       IF SQLCODE != -942 AND SQLCODE != -2289 THEN RAISE; END IF;
-- END;
-- /

-- Create Users Table and Sequence
CREATE TABLE Users (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    phone VARCHAR2(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE users_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER users_trg 
BEFORE INSERT ON Users 
FOR EACH ROW 
BEGIN
  IF :new.id IS NULL THEN
    SELECT users_seq.nextval INTO :new.id FROM dual;
  END IF;
END;
/

-- Create Accounts Table and Sequence
CREATE TABLE Accounts (
    id NUMBER PRIMARY KEY,
    user_id NUMBER NOT NULL,
    account_type VARCHAR2(20) CHECK (account_type IN ('Savings', 'Current')),
    balance NUMBER(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE SEQUENCE accounts_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER accounts_trg 
BEFORE INSERT ON Accounts 
FOR EACH ROW 
BEGIN
  IF :new.id IS NULL THEN
    SELECT accounts_seq.nextval INTO :new.id FROM dual;
  END IF;
END;
/

-- Create Transactions Table and Sequence
CREATE TABLE Transactions (
    id NUMBER PRIMARY KEY,
    account_id NUMBER NOT NULL,
    transaction_type VARCHAR2(20) CHECK (transaction_type IN ('Deposit', 'Withdraw', 'Transfer')),
    amount NUMBER(15, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR2(255),
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES Accounts(id) ON DELETE CASCADE
);

CREATE SEQUENCE transactions_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER transactions_trg 
BEFORE INSERT ON Transactions 
FOR EACH ROW 
BEGIN
  IF :new.id IS NULL THEN
    SELECT transactions_seq.nextval INTO :new.id FROM dual;
  END IF;
END;
/

-- Commit the changes
COMMIT;
EXIT;
