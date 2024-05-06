package server

import "go.mongodb.org/mongo-driver/bson/primitive"

const runsCollectionName = "runs"

type run struct {
	ID       primitive.ObjectID `bson:"_id" json:"_id"`
	Date     primitive.DateTime `json:"date"`
	Distance float64            `json:"distance"`
	Duration int64              `json:"duration"`
	RunType  string             `json:"runType"`
	Notes    string             `json:"notes"`
	Username string             `json:"username"`
	Location string             `json:"location"`
	Title    string             `json:"title"`
}

type leaderBoardRun struct {
	Distance float64 `json:"distance"`
	Username string  `json:"username"`
}
