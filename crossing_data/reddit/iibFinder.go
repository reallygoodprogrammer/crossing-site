// get as many links from the Internet is Beautiful
// subreddit as possible
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// internet is beautiful JSON response
type IIBResponse struct {
	Data struct {
		After	string `json:"after"`
		Children []struct {
			Data struct {
				Title	string `json:"title"`
				URL  	string `json:"url"`
				Id	string `json:"name"` 
			} `json:"data"`
		} `json:"children"`
	} `json:"data"`
}

func main() {
	id := ""
	for {
		id = request(id)
		time.Sleep(3 * time.Second)
	}
}

func request(id string) string {
	var url string = "https://www.reddit.com/r/InternetIsBeautiful/top/.json?t=all&sort=new"
	if id != "" {
		url = url + "&count=100&after=" + id
	}

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		panic(err)
	}
	req.Header.Set("User-Agent", "saplove-crossing.parser:v0.1")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var iibResponse IIBResponse
	if err = json.NewDecoder(resp.Body).Decode(&iibResponse); err != nil {
		panic(err)
	}

	for _, post := range iibResponse.Data.Children {
		fmt.Println(post.Data.URL)
	}
	return iibResponse.Data.After
}
