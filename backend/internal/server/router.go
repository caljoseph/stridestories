package server

import (
	"github.com/gin-gonic/gin"
)

//var upgrader = websocket.Upgrader{
//	CheckOrigin: func(r *http.Request) bool {
//		return true
//	},
//}

func NewRouter(s *Server) *gin.Engine {
	r := gin.Default()
	api := r.Group("/api")

	private := api.Group("/private")
	private.Use(s.authMiddleware())

	//r.GET("/ws", s.handleWebsocket)

	private.POST("/runs", s.postRun)
	private.PATCH("/users", s.updateBlog)

	api.POST("/register", s.registerUser)
	api.POST("/login", s.loginUser)

	api.DELETE("/logout", s.logoutUser)

	api.GET("/runs/:username", s.getRunsByUser)
	api.GET("/runs/longest_runs_by_month", s.getLongestRunsByMonth)
	api.GET("/users/:username", s.getUserByUsername)
	api.GET("/runs/longest_total_distance_by_month", s.getLongestTotalDistanceByMonth)

	return r
}

//func (s *Server) handleWebsocket(c *gin.Context) {
//	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
//	if err != nil {
//		c.JSON(http.StatusInternalServerError, gin.H{
//			"error": err.Error(),
//		})
//		log.Printf("Failed to set websocket upgrade: %v", err)
//		return
//	}
//	defer ws.Close()
//
//	for {
//		t, message, err := ws.ReadMessage()
//		if err != nil {
//			log.Println("Error reading message:", err)
//			break
//		}
//
//		err = ws.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("type: %s. message: %s.", t, message)))
//		if err != nil {
//			log.Println("Error writing message:", err)
//			break
//		}
//
//	}
//}
