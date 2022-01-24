package common

type Int64s []int64

func (i Int64s) Contains(v int64) bool {
	return Contains(i, v)
}

type Strings []string

func (s Strings) Contains(v string) bool {
	return Contains(s, v)
}
