DO $$

DECLARE

BEGIN

INSERT INTO department (id, name) VALUES
    ('Sales'),
    ('Permitting'),
    ('Installation');

INSERT INTO employee_role (id, title, salary, department_id) VALUES
    ('Sales Rep', 10000),
    ('Permit Tech', 20000),
    ('Install Tech', 30000);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
    ('Jessica', 'Grants'),
    ('Tatiana', 'Rhodes'),
    ('Bryant', 'Fields');
   

   
RAISE NOTICE 'Database created successfully!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '!ERROR! Database failed! %', SQLERRM;
        ROLLBACK;
END $$;