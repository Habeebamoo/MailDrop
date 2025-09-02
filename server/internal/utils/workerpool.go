package utils

import (
	"sync"
)

type EmailJob struct {
	SenderName     string
	SenderEmail    string
	ReceiverEmail  string
	Subject        string
	Content        string
}

type WorkerPool struct {
	noOfWorkers  int
	emailsChan   <-chan EmailJob
	resultChan   chan<- error
	wg           *sync.WaitGroup
}

func NewWorkerPool(noOfWorkers int, emailsChan <-chan EmailJob, resChan chan<- error, wg *sync.WaitGroup) *WorkerPool {
	return &WorkerPool{noOfWorkers: noOfWorkers, emailsChan: emailsChan, resultChan: resChan, wg: wg}
}

func (wp *WorkerPool) Work() {
	defer wp.wg.Done()
	for emailJob := range wp.emailsChan {
		//send response back to the main program
		wp.resultChan <- SendPromotionalEmail(emailJob)
	}
}

func (wp *WorkerPool) Run() {
	for w := 1; w <= wp.noOfWorkers; w++ {
		wp.wg.Add(1)
		go wp.Work()
	}
}