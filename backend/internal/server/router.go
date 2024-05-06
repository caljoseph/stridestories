package server

import "github.com/gin-gonic/gin"

func NewRouter(s *Server) *gin.Engine {
	r := gin.Default()
	api := r.Group("/api")

	private := api.Group("/private")
	private.Use(s.authMiddleware())

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
