package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"realtimeForum/db"
	"realtimeForum/utils"
	"strconv"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow WebSocket connections from http://localhost:8080
		allowedOrigins := []string{
			"https://localhost:8080", //backend
			"https://localhost:3000", //frontend
		}
		origin := r.Header.Get("Origin")
		for _, allowedOrigin := range allowedOrigins {
			if origin == allowedOrigin {
				return true
			}
		}
		return false
	},
}

// deals with the websocket side of chat
func ChatHandler(w http.ResponseWriter, r *http.Request) {

	// Upgrade the HTTP connection to a WebSocket connection
	connection, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("There was an error with Upgrade in WebSocketHandler,", err)
		return
	}
	defer connection.Close()

	// Handle incoming and outgoing WebSocket messages here
	// Use Go channels to broadcast messages to all connected clients

	for {
		messageType, payload, err := connection.ReadMessage()
		if err != nil {
			log.Println("WebSocket read error:", err)
			return
		}
		if messageType == websocket.TextMessage {
			// Process the incoming message
			fmt.Println("Received a WebSocket message:", string(payload))
			// Handle the message and broadcast it to other clients if needed
			var chatMsg db.ChatMessage
			// Unmarshal the JSON into the struct
			err := json.Unmarshal([]byte(payload), &chatMsg)
			if err != nil {
				fmt.Println("Error unmarshaling JSON:", err)
				return
			}

			previousChatEntryFound, chatUUID, err := previousChatChecker(chatMsg.Sender, chatMsg.Recipient)

			if err != nil {
				log.Println("Error with chatChecker in ChatHandler", err)
				utils.HandleError("Error with chatChecker in ChatHandler", err)
			}

			// if chat is new then generates new UUID for chat
			if !previousChatEntryFound {
				fmt.Println("chatIsNew", previousChatEntryFound)
				chatUUID = utils.GenerateNewUUID()
				fmt.Println("Generated UUID:", chatUUID)
			}

			err = db.AddChatToDatabase(chatUUID, chatMsg.Message, chatMsg.Sender, chatMsg.Recipient)
			if err != nil {
				log.Println("There has been an issue with AddChatToDatabase in ChatHandler", err)
				utils.HandleError("There has been an issue with AddChatToDatabase in ChatHandler", err)
			}
			// Access the individual fields
			fmt.Println("Type:", chatMsg.Type)
			fmt.Println("Message:", chatMsg.Message)
			fmt.Println("Sender:", chatMsg.Sender)
			fmt.Println("Recipient:", chatMsg.Recipient)
		}
	}
}

// Checks to see if chat between two users has taken place before, if so then returns chat UUID
func previousChatChecker(firstID int, secondID int) (bool, string, error) {
	query := `
	SELECT ChatUUID
	FROM CHAT
	WHERE (SenderID = ? AND RecipientID = ?) OR (SenderID = ? AND RecipientID = ?)
	LIMIT 1
`

	// Execute the query and try to fetch the ChatUUID
	var chatUUID string
	err := db.Database.QueryRow(query, firstID, secondID, secondID, firstID).Scan(&chatUUID)
	if err != nil {
		if err == sql.ErrNoRows {
			// Entry doesn't exist
			return false, "", nil
		}
		return false, "", err
	}

	// Entry exists, return true and the ChatUUID
	return true, chatUUID, nil
}

func GetChatHistoryHandler(w http.ResponseWriter, r *http.Request) {

	SetupCORS(&w, r)

	chatUser1 := r.URL.Query().Get("user1")
	chatUser2 := r.URL.Query().Get("user2")

	var user1 int
	var user2 int

	user1, _ = strconv.Atoi(chatUser1)
	user2, _ = strconv.Atoi(chatUser2)

	_, chatUUID, _ := previousChatChecker(user1, user2)
	chatHistory, err := db.GetChatFromDatabase(chatUUID)
	if err != nil {
		utils.HandleError("Error retrieving chat history from the database:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Serialize chat history to JSON and send it as the response
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(chatHistory); err != nil {
		utils.HandleError("Error encoding chat history to JSON:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
