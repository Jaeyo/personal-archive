package common

type Numeric interface {
	~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 | ~int | ~int8 | ~int16 | ~int32 | ~int64
}

func Contains[S ~[]T, T comparable](list S, value T) bool {
	for _, item := range list {
		if item == value {
			return true
		}
	}
	return false
}

func ContainsField[S ~[]T, T any, FT comparable](list S, getField func(T) FT, fieldValue FT) bool {
	for _, item := range list {
		if getField(item) == fieldValue {
			return true
		}
	}
	return false
}

func SplitBy[S ~[]T, T any](list S, isExcluded func(T) bool) ([]T, []T) {
	var excluded, notExcluded []T
	for _, item := range list {
		if isExcluded(item) {
			excluded = append(excluded, item)
		} else {
			notExcluded = append(notExcluded, item)
		}
	}
	return excluded, notExcluded
}

func Unique[S ~[]T, T comparable](list S) []T {
	allKeys := make(map[T]bool)
	var result []T
	for _, item := range list {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			result = append(result, item)
		}
	}
	return result
}

func Map[S ~[]T, T any, RT any](list S, mapFn func(T) RT) []RT {
	var results []RT
	for _, item := range list {
		results = append(results, mapFn(item))
	}
	return results
}

func FlatMap[S ~[]T, T any, RT any](list S, flatMapFn func(T) []RT) []RT {
	var results []RT
	for _, item := range list {
		results = append(results, flatMapFn(item)...)
	}
	return results
}

func MapWithErr[S ~[]T, T any, RT any](list S, mapFn func(T) (RT, error)) ([]RT, error) {
	var results []RT
	for _, item := range list {
		result, err := mapFn(item)
		if err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	return results, nil
}

func Max[T Numeric](list []T) T {
	var max T

	if len(list) == 0 {
		return max
	}

	max = list[0]
	for _, value := range list {
		if value > max {
			max = value
		}
	}

	return max
}
