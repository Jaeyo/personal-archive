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

type Int64s []int64

func (i Int64s) Contain(v int64) bool {
	for _, item := range i {
		if item == v {
			return true
		}
	}
	return false
}

type Strings []string

func (s Strings) Contain(v string) bool {
	for _, item := range s {
		if item == v {
			return true
		}
	}
	return false
}
