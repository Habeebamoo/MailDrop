package service

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/Habeebamoo/MailDrop/server/internal/utils"
	"github.com/google/uuid"
)

type CampaignService interface {
	CreateCampaign(*models.CampaignRequest) (int, error)
	GetCampaign(uuid.UUID) (models.Campaign, int, error)
	GetAllCampaigns(uuid.UUID) ([]models.CampaignResponse, int, error)
	DeleteCampaign(uuid.UUID) (int, error)
	GetSubscribers(uuid.UUID) ([]models.Subscriber, int, error)
	DownloadSubscribers(uuid.UUID) (models.Campaign, []models.Subscriber, int, error)
	CreateSubscriber(*models.SubscriberRequest, uuid.UUID, uuid.UUID) (string, int, error)
	DeleteSubscriber(*models.DeleteSubscriberRequest, uuid.UUID, uuid.UUID) (string, string, int, error)
	GetSubscriberCampaign(uuid.UUID) (models.SubscriberCampaignResponse, int, error)
	CampaignClick(uuid.UUID) (int, error)
	SendMail(emailReq *models.EmailRequest) (int, error)
}

type CampaignSvc struct {
	repo repositories.CampaignRepository
}

func NewCampaignService(repo repositories.CampaignRepository) CampaignService {
	return &CampaignSvc{repo: repo}
}

func (campaignSvc *CampaignSvc) CreateCampaign(campaignReq *models.CampaignRequest) (int, error) {
	campaignId, _ := uuid.Parse(campaignReq.UserId)
	//checks is campaign exists
	exists := campaignSvc.repo.CampaignExists(campaignId, campaignReq.Title)
	if exists {
		return http.StatusConflict, fmt.Errorf("a campaign with this title already exists")
	}

	//prepopulate the request
	userId, _ := uuid.Parse(campaignReq.UserId)

	campaign := models.Campaign{
		UserId: userId,
		Title: campaignReq.Title,
		Description: campaignReq.Description,
		LeadMagnetName: campaignReq.LeadMagnetName,
		LeadMagnetUrl: campaignReq.LeadMagnetUrl,
		Slug: "",
		Active: true,
		CreatedAt: time.Now(),
	}

	return campaignSvc.repo.CreateCampaign(campaign, userId)
}

func (campaignSvc *CampaignSvc) GetCampaign(campaignId uuid.UUID) (models.Campaign, int, error) {
	return campaignSvc.repo.GetCampaign(campaignId)
}

func (campaignSvc *CampaignSvc) GetAllCampaigns(userId uuid.UUID) ([]models.CampaignResponse, int, error) {
	return campaignSvc.repo.GetAllCampaigns(userId)
}

func (campaignSvc *CampaignSvc) DeleteCampaign(campaignId uuid.UUID) (int, error) {
	//get campaign
	campaign, code, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return code, err
	}

	//delete campaign
	code, err = campaignSvc.repo.DeleteCampaign(campaign)
	if err != nil {
		return code, err
	}

	//update subscribers
	subscribers, code, _ := campaignSvc.repo.GetSubscribers(campaignId)
	if code == 404 {
		return 200, nil
	}

	err = campaignSvc.repo.ArchiveSubscribers(subscribers, campaignId)
	if err != nil {
		return 500, err
	}

	return 200, nil
}

func (campaignSvc *CampaignSvc) GetSubscribers(campaignId uuid.UUID) ([]models.Subscriber, int, error) {
	return campaignSvc.repo.GetSubscribers(campaignId)
}

func (campaignSvc *CampaignSvc) CreateSubscriber(subscriberReq *models.SubscriberRequest, userId uuid.UUID, campaignId uuid.UUID) (string, int, error) {
	subscriber := models.Subscriber{
		CampaignId: campaignId,
		CampaignStatus: "active",
		UserId: userId,
		Name: subscriberReq.Name,
		Email: subscriberReq.Email,
		CreatedAt: time.Now(),
	}

	//get the campaign
	campaign, code, err := campaignSvc.repo.GetCampaign(subscriber.CampaignId)
	if err != nil {
		return "", code, err
	}

	//get user
	user, code, err := campaignSvc.repo.GetCampaignUser(subscriber.UserId)
	if err != nil {
		return "", code, err
	}

	//check if the email already exist
	exists := campaignSvc.repo.SubscriberExist(subscriber.Email, campaign.CampaignId)
	if exists {
		return "You were already a member of this campaign", 200, nil
	}

	//register the subscriber
	msg, code, err := campaignSvc.repo.CreateSubscriber(subscriber, userId, campaignId, campaign.Title)
	if err != nil {
		return msg, code, err
	}

	//notify the user
	go utils.SendSubscriptionEmail(user, subscriber, campaign.Title)

	//send reward to subscriber's email
	if (campaign.LeadMagnetName == "") {
		return msg, code, err
	}

	code, err = utils.SendRewardEmail(subscriber.Name, subscriber.Email, campaign.Title, campaign.LeadMagnetUrl)
	if err != nil {
		return "", code, err
	}

	return msg, code, nil
}

func (campaignSvc *CampaignSvc) DeleteSubscriber(subscriberReq *models.DeleteSubscriberRequest, subscriberId uuid.UUID, campaignId uuid.UUID) (string, string, int, error) {
	//get campaign
	campaign, statusCode, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return "", "", statusCode, err
	}

	//get user
	campaignOwner, statusCode, err := campaignSvc.repo.GetCampaignUser(campaign.UserId)
	if err != nil {
		return "", "", statusCode, err
	}

	//verify subscriber
	subscriber, statusCode, err := campaignSvc.repo.VerifySubscriber(subscriberId, campaignId)
	if err != nil {
		return "", "", statusCode, err
	}

	//delete subscriber
	statusCode, err = campaignSvc.repo.DeleteSubscriber(subscriberId, campaign, campaign.UserId)
	if err != nil {
		return "", "", statusCode, err
	}

	//send email to campaign owner
	go utils.SendUnsubscriptionEmail(campaignOwner, campaign.Title, subscriber.Email, subscriberReq)
	
	return campaign.Title, subscriber.Email, 200, nil
}

func (campaignSvc *CampaignSvc) CampaignClick(campaignId uuid.UUID) (int, error) {
	//get the user associated with the campaign
	campaign, code, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return code, err
	}

	return campaignSvc.repo.CreateCampaignClick(campaign.UserId, campaign.CampaignId)
}

func (campaignSvc *CampaignSvc) DownloadSubscribers(campaignId uuid.UUID) (models.Campaign, []models.Subscriber, int, error) {
	//get the campaign
	campaign, statusCode, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return models.Campaign{}, []models.Subscriber{}, statusCode, err
	}

	//get the subscribers
	subscribers, statusCode, err := campaignSvc.repo.GetSubscribers(campaignId)
	return campaign, subscribers, statusCode, err
}

func (campaignSvc *CampaignSvc) GetSubscriberCampaign(campaignId uuid.UUID) (models.SubscriberCampaignResponse, int, error) {
	//get campaign
	campaign, statusCode, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return models.SubscriberCampaignResponse{}, statusCode, err
	}

	//get user
	user, statusCode, err := campaignSvc.repo.GetCampaignUser(campaign.UserId)
	if err != nil {
		return models.SubscriberCampaignResponse{}, statusCode, err
	}

	campaignResponse := models.SubscriberCampaignResponse{
		UserId: campaign.UserId,
		CampaignId: campaign.CampaignId,
		UserName: user.Name,
		UserBio: user.Profile.Bio,
		UserPicture: user.Profile.ProfilePic,
		Title: campaign.Title,
		Description: campaign.Description,
		LeadMagnetName: campaign.LeadMagnetName,
		LeadMagnetUrl: campaign.LeadMagnetUrl,
	}

	return campaignResponse, 200, nil
}

func (campaignSvc *CampaignSvc) SendMail(emailReq *models.EmailRequest) (int, error) {
	//get user
	userId, _ := uuid.Parse(emailReq.UserId)
	user, _, err := campaignSvc.repo.GetCampaignUser(userId)
	if err != nil {
		return 500, fmt.Errorf("internal server error: get user")
	}

	campaignId, _ := uuid.Parse(emailReq.CampaignId)
	//get campaign
	campaign, code, err := campaignSvc.GetCampaign(campaignId)
	if err != nil {
		return code, err
	}

	//get campaign subscribers
	subscribers, code, err := campaignSvc.repo.GetSubscribers(campaignId)
	if err != nil {
		return code, err
	}

	var senderName string
	if emailReq.SenderName == "" {
		senderName = user.Name
	} else {
		senderName = emailReq.SenderName
	}

	//send a demo/test to the sender's email
	if err := utils.SendTestEmail(user, emailReq.Content, campaign); err != nil {
		return 500, fmt.Errorf("failed to schedule emails")
	}

	//send email to subscribers via WorkerPools Goroutines
	var wg sync.WaitGroup
	emailChan := make(chan utils.EmailJob, len(subscribers))

	noOfWorkers := utils.GenerateElasticWorker(len(subscribers))

	workerPool := utils.NewWorkerPool(noOfWorkers, emailChan, &wg) //spawn elastic-number of workers
	workerPool.Run()

	//give emailsjobs to workers via channels
	for _, subscriber := range subscribers {
		emailChan <- utils.EmailJob{
			SenderName: senderName,
			SenderEmail: user.Email,
			CampaignId: campaign.CampaignId.String(),
			ReceiverId: subscriber.SubscriberId.String(),
			Subject: emailReq.Subject,
			Content: emailReq.Content,
			ReceiverEmail: subscriber.Email,
		}
	}
	close(emailChan)

	// a new goroutines to wait for all workers to finish
	go func() {
		wg.Wait()
	}()

	_, err = campaignSvc.repo.UpdateUserEmails(userId, campaignId, campaign.Title)
	if err != nil {
		return 500, err
	}

	return 200, nil
}