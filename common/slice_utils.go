package common


type Int64s []int64

func (i Int64s) Contain(v int64) bool {
	return contains[int64](i, v)
}

type Strings []string

func (s Strings) Contain(v string) bool {
	return contains[string](s, v)
}

func contains[T any](a []T, b T) bool {
	for _, item := range a {
		if item == b {
			return true
		}
	}
	return false
}
