package db

import (
	//"log"
	"realtimeForum/utils"
)

func AddRegistrationToDatabase(username string, age int, gender string, firstName string, lastName string, email string, password string) error {
	_, err := Database.Exec("INSERT INTO REGISTRATION (Username, Age, Gender, First_name, Last_name, Email, Password) VALUES (?, ?, ?, ?, ?, ?, ?)", username, age, gender, firstName, lastName, email, password)
	if err != nil {
		//log.Println("Error adding registration to database:", err)
		utils.HandleError("Error adding registration to database", err)
	}
	return err
}

func GetRegistrationFromDatabase() ([]RegistrationEntry, error) {
	rows, err := Database.Query("SELECT Username, Age, Gender, First_name, Last_name, Email, Password FROM Registration ORDER BY Id ASC")
	if err != nil {
		//og.Println("Error querying registrations from database:", err)
		utils.HandleError("Error querying registrations from database", err)
		return nil, err
	}
	defer rows.Close()

	var registrations []RegistrationEntry
	for rows.Next() {
		var entry RegistrationEntry
		err := rows.Scan(&entry.Username, &entry.Age, &entry.Gender, &entry.FirstName, &entry.LastName, &entry.Email, &entry.Password)
		if err != nil {
			//log.Println("Error scanning row from database:", err)
			utils.HandleError("Error scanning row from database", err)
			return nil, err
		}
		registrations = append(registrations, entry)
	}

	return registrations, nil
}
