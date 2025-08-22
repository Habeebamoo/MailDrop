package service

import (
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/google/uuid"
)

type CampaignService interface {
	CreateCampaign(models.CampaignRequest) (int, error)
	GetCampaign(uuid.UUID) (models.Campaign, int, error)
	GetAllCampaigns(uuid.UUID) ([]models.CampaignResponse, int, error)
	DeleteCampaign(uuid.UUID) (int, error)
	GetSubscribers(uuid.UUID) ([]models.Subscriber, int, error)
	CreateSubscriber(models.SubscriberRequest, uuid.UUID, uuid.UUID) (string, int, error)
	CampaignClick(uuid.UUID) (int, error)
}

type CampaignSvc struct {
	repo repositories.CampaignRepository
}

func NewCampaignService(repo repositories.CampaignRepository) CampaignService {
	return &CampaignSvc{repo: repo}
}

func (campaignSvc *CampaignSvc) CreateCampaign(campaignReq models.CampaignRequest) (int, error) {
	//prepopulate the request
	userId, _ := uuid.Parse(campaignReq.UserId)

	campaign := models.Campaign{
		UserId: userId,
		UserName: campaignReq.UserName,
		UserBio: campaignReq.UserBio,
		Title: campaignReq.Title,
		Description: campaignReq.Description,
		LeadMagnetName: campaignReq.LeadMagnetName,
		LeadMagnetUrl: campaignReq.LeadMagnetUrl,
		Slug: "",
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
	campaign, code, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return code, err
	}

	return campaignSvc.repo.DeleteCampaign(campaign)
}

func (campaignSvc *CampaignSvc) GetSubscribers(campaignId uuid.UUID) ([]models.Subscriber, int, error) {
	return campaignSvc.repo.GetSubscribers(campaignId)
}

func (campaignSvc *CampaignSvc) CreateSubscriber(subscriberReq models.SubscriberRequest, userId uuid.UUID, campaignId uuid.UUID) (string, int, error) {
	//checks if subscriber already exist
	exists := campaignSvc.repo.SubscriberExist(subscriberReq.Email)
	if exists {
		return "You are already a member of this campaign", 200, nil
	}

	//register the subscriber
	subscriber := models.Subscriber{
		CampaignId: campaignId,
		UserId: userId,
		Name: subscriberReq.Name,
		Email: subscriberReq.Email,
	}

	campaign, code, err := campaignSvc.repo.GetCampaign(subscriber.CampaignId)
	if err != nil {
		return "", code, err
	}

	code, err = campaignSvc.repo.CreateSubscriber(subscriber, userId, campaignId, campaign.Title)
	if err != nil {
		return "", code, err
	}

	return "Registeration Successful", code, err
}

func (campaignSvc *CampaignSvc) CampaignClick(campaignId uuid.UUID) (int, error) {
	//get the user associated with the campaign
	campaign, code, err := campaignSvc.repo.GetCampaign(campaignId)
	if err != nil {
		return code, err
	}

	return campaignSvc.repo.CreateCampaignClick(campaign.UserId, campaign.CampaignId)
}