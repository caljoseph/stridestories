package server

import "github.com/gin-gonic/gin"

func NewRouter(s *Server) *gin.Engine {
	r := gin.Default()

	private := r.Group("/private")
	private.Use(s.authMiddleware())

	private.POST("/runs", s.postRun)
	private.PATCH("/users", s.updateBlog)

	r.POST("/register", s.registerUser)
	r.POST("/login", s.loginUser)

	r.DELETE("/logout", s.logoutUser)

	//r.GET("/runs/:id", s.getRunById)
	r.GET("/runs/:username", s.getRunsByUser)
	r.GET("/runs/longest_run_by_month", s.getLongestRunsByMonth)
	r.GET("/users/:username", s.getUserByUsername)
	r.GET("/runs/longest_total_distance_by_month", s.getLongestTotalDistanceByMonth)

	return r
}
