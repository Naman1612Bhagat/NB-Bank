-- Create Reviews Table and Sequence
CREATE TABLE Reviews (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    rating NUMBER(1,0) CHECK (rating >= 1 AND rating <= 5),
    comment_text VARCHAR2(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE reviews_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER reviews_trg 
BEFORE INSERT ON Reviews 
FOR EACH ROW 
BEGIN
  IF :new.id IS NULL THEN
    SELECT reviews_seq.nextval INTO :new.id FROM dual;
  END IF;
END;
/

-- Commit the changes
COMMIT;
EXIT;
