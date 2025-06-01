# ft_transcendence

## Getting Started

Follow these steps to set up and run the project:

### 1. Build the Project

```bash
make
```

### 2. Access the SQLITE container

1. Access the sqlite container:

   	```

 	 cd pong_backend/data
	```

	```sh
	 docker exec -it trans_app_1 sh

	```
	```
	 sqlite3 database.sqlite
	```

3. In the SQLITE prompt see table players

	```
	 .tables
	```

 	```
	 SELECT * FROM players;
	```
   
   
	
WORKING ON THIS 

### 3. Verify User Permissions

To check that the permissions were granted correctly, run:

```sql
SHOW GRANTS FOR 'ponguser'@'%';
```

---

Now you can make again.

### 4. Access the application

   Open your browser and go to:  
   [http://localhost](http://localhost)

**Note:** You may need to accept self-signed certificates in your browser to access the application securely.




**Note:** The volumes will be automatically created in the root in a folder "volumes", inside there are two folders, db-data and frontend. Volumes are not added to the remote repo. 
