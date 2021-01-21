package pocket

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/pasztorpisti/qs"
	"github.com/pkg/errors"
	"github.com/tidwall/gjson"
	"io/ioutil"
	"net/http"
	"strconv"
)

func ObtainRequestToken(consumerKey, redirectURI string) (string, error) {
	params := fmt.Sprintf("consumer_key=%s&redirect_uri=%s", consumerKey, redirectURI)
	reqBody := bytes.NewBufferString(params)
	url := "https://getpocket.com/v3/oauth/request"
	resp, err := http.Post(url, "application/x-www-form-urlencoded; charset=UTF-8", reqBody)
	if err != nil {
		return "", errors.Wrap(err, "failed to request http post")
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("invalid status: %d", resp.StatusCode)
	}

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", errors.Wrap(err, "failed to read body")
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
	resp, err := http.Post(url, "application/x-www-form-urlencoded; charset=UTF-8", reqBody)
	if err != nil {
		return false, "", "", errors.Wrap(err, "failed to request http post")
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusForbidden {
		return false, "", "", nil
	} else if resp.StatusCode != http.StatusOK {
		return false, "", "", fmt.Errorf("invalid status: %d", resp.StatusCode)
	}

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return false, "", "", errors.Wrap(err, "failed to read body")
	}

	var m map[string]string
	if err := qs.Unmarshal(&m, string(respBody)); err != nil {
		return false, "", "", errors.Wrap(err, "failed to unmarshal response body")
	}

	return true, m["access_token"], m["username"], nil
}

func Retrieve(consumerKey, accessToken string, offset, count int) ([]string, error){
	params := map[string]string{
		"consumer_key": consumerKey,
		"access_token": accessToken,
		"state": "all",
		"detailType": "simple",
		"sort": "oldest",
		"offset": strconv.Itoa(offset),
		"count": strconv.Itoa(count),
	}
	paramsBytes, err := json.Marshal(params)
	if err != nil {
		return nil, errors.Wrap(err, "failed to marshal params")
	}

	url := "https://getpocket.com/v3/get"
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(paramsBytes))
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

	items := gjson.Get(string(respBody), "list")
	urls := []string{}
	items.ForEach(func(_, value gjson.Result) bool {
		urls = append(urls, value.Get("resolved_url").String())
		return true
	})

	return urls, nil
}