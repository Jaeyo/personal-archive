package pocket

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/pasztorpisti/qs"
	"github.com/pkg/errors"
	"github.com/tidwall/gjson"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
)

func ObtainRequestToken(consumerKey, redirectURI string) (string, error) {
	params := fmt.Sprintf("consumer_key=%s&redirect_uri=%s", consumerKey, redirectURI)
	url := "https://getpocket.com/v3/oauth/request"

	respBody, err := requestPost(url, "application/x-www-form-urlencoded; charset=UTF-8", bytes.NewBufferString(params))
	if err != nil {
		return "", err
	}

	var m map[string]string
	if err := qs.Unmarshal(&m, string(respBody)); err != nil {
		return "", errors.Wrap(err, "failed to unmarshal response body")
	}
	return m["code"], nil
}

func ObtainAccessTokenAndUsername(consumerKey, requestToken string) (bool, string, string, error) {
	reqBody := bytes.NewBufferString(fmt.Sprintf("consumer_key=%s&code=%s", consumerKey, requestToken))
	url := "https://getpocket.com/v3/oauth/authorize"

	respBody, err := requestPost(url, "application/x-www-form-urlencoded; charset=UTF-8", reqBody)
	if err != nil {
		return false, "", "", err
	}

	var m map[string]string
	if err := qs.Unmarshal(&m, string(respBody)); err != nil {
		return false, "", "", errors.Wrap(err, "failed to unmarshal response body")
	}

	return true, m["access_token"], m["username"], nil
}

func Retrieve(consumerKey, accessToken string, offset, count int) ([]string, error) {
	params := map[string]string{
		"consumer_key": consumerKey,
		"access_token": accessToken,
		"state":        "all",
		"detailType":   "simple",
		"sort":         "oldest",
		"offset":       strconv.Itoa(offset),
		"count":        strconv.Itoa(count),
	}
	paramsBytes, err := json.Marshal(params)
	if err != nil {
		return nil, errors.Wrap(err, "failed to marshal params")
	}

	url := "https://getpocket.com/v3/get"
	respBody, err := requestPost(url, "application/json", bytes.NewBuffer(paramsBytes))

	items := gjson.Get(string(respBody), "list")
	urls := []string{}
	items.ForEach(func(_, value gjson.Result) bool {
		urls = append(urls, value.Get("resolved_url").String())
		return true
	})

	return urls, nil
}

func requestPost(url, contentType string, body io.Reader) ([]byte, error) {
	resp, err := http.Post(url, contentType, body)
	if err != nil {
		return nil, errors.Wrap(err, "failed to request http post")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid status: %d", resp.StatusCode)
	}

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.Wrap(err, "failed to read body")
	}

	return respBody, nil
}
