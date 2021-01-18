package common

import "os"

func getEnv() string {
	return os.Getenv("ENV")
}

func IsLocal() bool {
	return getEnv() == "local"
}
