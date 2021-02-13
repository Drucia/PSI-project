package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"time"
)

type baseURL struct {
	protocol, ip, port string
}

type testedRequest struct {
	endpoint          string
	method            string
	body              []byte
	desiredStatusCode int
}

func (b baseURL) getUrl(endpoint string) string {
	return b.protocol + "://" + b.ip + ":" + b.port + endpoint
}

func timeToReachHost(url *baseURL) time.Duration {
	fmt.Println("Computing average connection speed to host...")
	start := time.Now()
	for i := 0; i < 10; i++ {
		_, err := http.Get(url.getUrl("/"))
		if err != nil {
			log.Fatal("Can't reach host...")
		}
	}
	stop := time.Since(start)
	fmt.Println("Speed connection measured.")
	return stop / 10
}

func main() {
	sendsPerRequestFlag := flag.Int("c", 10,
		"Every endpoint request will be sent that many times.")
	getTestFlag := flag.Bool("g", false, "Make GET tests.")
	postTestFlag := flag.Bool("p", false, "Make POST tests.")
	flag.Parse()

	sendsPerRequest := *sendsPerRequestFlag
	host := baseURL{
		protocol: "http",
		ip:       "54.175.219.85",
		port:     "10521",
	}

	postTestBody, _ := json.Marshal(map[string]string{
		"email":    "user@user.com",
		"password": "userPassworD1!",
	})

	var requests []testedRequest
	if *postTestFlag {
		fmt.Println("Chosen POST testing.")
		requests = append(requests,
			testedRequest{
				endpoint:          host.getUrl("/api/user/login"),
				method:            "POST",
				body:              postTestBody,
				desiredStatusCode: 200,
			})

	}

	if *getTestFlag {
		fmt.Println("Chosen GET testing.")
		requests = append(requests,
			testedRequest{
				endpoint:          host.getUrl("/api/user/login"),
				method:            "GET",
				desiredStatusCode: 405,
			})
	}

	var timeSum time.Duration = 0

	for i := 0; i < sendsPerRequest; i++ {
		for _, request := range requests {
			switch request.method {
			case "GET":
				start := time.Now()
				resp, err := http.Get(request.endpoint)
				timeSum += time.Since(start)
				if resp != nil && resp.StatusCode != request.desiredStatusCode {
					fmt.Println("Wrong status code, got", resp.StatusCode, "needed", request.desiredStatusCode)
				}

				if resp != nil {
					if resp.Body.Close() != nil {
						log.Fatal("Problem during closing response body...")
					}
				}
				if err != nil {
					fmt.Println("Error: ", err)
				}

			case "POST":
				start := time.Now()
				resp, err := http.Post(request.endpoint, "application/json", bytes.NewBuffer(request.body))
				timeSum += time.Since(start)
				if resp != nil && resp.StatusCode != request.desiredStatusCode {
					fmt.Println("Wrong status code, got", resp.StatusCode, "needed", request.desiredStatusCode)
				}

				if resp != nil {
					//data, _ := ioutil.ReadAll(resp.Body)
					if resp.Body.Close() != nil {
						log.Fatal("Problem during closing response body...")
					}
					//fmt.Printf("%s\n", data)
				}
				if err != nil {
					fmt.Println("Error: ", err)
				}

			default:
				fmt.Printf("%s is not supported request method\n", request.method)
			}
		}
		if i+1%5 == 0 {
			fmt.Println("In progress, every endpoint has been checked", i, "/", sendsPerRequest, "times...")
		}
	}
	timeToHost := timeToReachHost(&host) // has to be at the end not first since first request takes the longest time
	timeSum = timeSum - (timeToHost * time.Duration(len(requests)))
	timePerRequest := timeSum/time.Duration(sendsPerRequest*len(requests)) - timeToHost

	if timePerRequest < 0 {
		timePerRequest, _ = time.ParseDuration("1ns")
	}

	fiveSecs, _ := time.ParseDuration("5s")
	fmt.Println("RESULTS:")
	fmt.Println("Time to reach host:              ", timeToHost)
	fmt.Println("Total requests:                  ", sendsPerRequest*len(requests))
	fmt.Println("Total computation time:          ", timeSum)
	fmt.Println("Computation time per request:    ", timePerRequest)
	fmt.Println("Users that can be handled in 5s: ", fiveSecs.Nanoseconds()/timePerRequest.Nanoseconds())
}
