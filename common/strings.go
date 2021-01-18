package common

type Strings []string

func (s Strings) Contain(v string) bool {
	for _, item := range s {
		if item == v {
			return true
		}
	}
	return false
}
