package main

import (
	"fmt"
	"github.com/playwright-community/playwright-go"
	"sync"
)

func main() {
	pw, err := playwright.Run()
	if err != nil {
		panic(err)
	}
	browser, err := pw.Chromium.Launch(playwright.BrowserTypeLaunchOptions{
		Headless: playwright.Bool(false),
		Args:     []string{"--no-sandbox"},
	})
	if err != nil {
		panic(err)
	}
	urls := make(chan string)

	var wg sync.WaitGroup
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for url := range urls {
				page, err := browser.NewPage()
				if err != nil {
					panic(err)
				}

				if _, err = page.Goto(url); err != nil {
					panic(err)
				}
				entries, err := page.Locator("div > h4 > a").All()
				if err != nil {
					panic(err)
				}
				for _, entry := range entries {
					href, err := entry.GetAttribute("href")
					if err != nil {
						fmt.Println("error:", err)
						continue
					} 
					page2, err := browser.NewPage()
					if err != nil {
						panic(err)
					}
					_, err = page2.Goto("https://foundwork.art"+href, playwright.PageGotoOptions{
						WaitUntil: playwright.WaitUntilStateNetworkidle,
					}); 
					if err != nil {
						fmt.Println("error:", err)
						continue
					} else {
						en := page2.Locator("p > a").First()
						h, err := en.GetAttribute("href")
						if err != nil {
							fmt.Println("error:", err)
						} else if h != "/privacy" {
							fmt.Println(h)
						}
					}
					page2.Close()
				}
				page.Close()
			}
		}()
	}

	for i:=81; i < 89; i++ {
		url := fmt.Sprintf("https://foundwork.art/artists?page=%d", i)
		urls <- url
	}
	close(urls)

	wg.Wait()

	if err = browser.Close(); err != nil {
		panic(err)
	}
	if err = pw.Stop(); err != nil {
		panic(err)
	}
}
