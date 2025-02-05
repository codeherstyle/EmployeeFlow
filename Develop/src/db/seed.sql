DO$$

DECLARE

BEGIN

INSERT INTO department (id, name) VALUES
    (1,'Sales'),
    (2, 'Permitting'),
    (3, 'Installation');

INSERT INTO employee_role (id, title, salary, department_id) VALUES
    (111, 'Sales Rep', 10000, 1),
    (222, 'Permit Tech', 20000, 2),
    (333, 'Install Tech', 30000, 3);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES
    (1001, 'Jessica', 'Grants', 111, NULL ),
    (2002, 'Tatiana', 'Rhodes', 222, 1001),
    (3003, 'Bryant', 'Fields', 333, 1001);
   

   
RAISE NOTICE 'Database created successfully!'
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '!ERROR! Database failed!', SQLERRM;
        ROLLBACK;
END $$;