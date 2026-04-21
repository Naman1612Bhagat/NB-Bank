-- Create Feedbacks Table and Sequence
CREATE TABLE Feedbacks (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL,
    subject VARCHAR2(255),
    message VARCHAR2(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE feedbacks_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER feedbacks_trg 
BEFORE INSERT ON Feedbacks 
FOR EACH ROW 
BEGIN
  IF :new.id IS NULL THEN
    SELECT feedbacks_seq.nextval INTO :new.id FROM dual;
  END IF;
END;
/

-- Commit the changes
COMMIT;
EXIT;
