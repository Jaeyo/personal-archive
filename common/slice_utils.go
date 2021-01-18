package common

func HasInt(s []int, value int) bool {
	for _, v := range s {
		if v == value {
			return true
		}
	}
	return false
}

func RemoveInt(s []int, value int) []int {
	var result []int
	for _, v := range s {
		if v != value {
			result = append(result, v)
		}
	}
	return result
}
