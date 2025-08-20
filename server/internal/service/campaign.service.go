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
	GetAllCampaigns(uuid.UUID) ([]models.Campaign, int, error)
	DeleteCampaign(uuid.UUID) (int, error)
	GetSubscribers(uuid.UUID) ([]models.Subscriber, int, error)
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
		Title: campaignReq.Title,
		Description: campaignReq.Description,
		LeadMagnetUrl: campaignReq.LeadMagnetUrl,
		Slug: "",
		CreatedAt: time.Now(),
	}

	return campaignSvc.repo.CreateCampaign(campaign, userId)
}

func (campaignSvc *CampaignSvc) GetCampaign(campaignId uuid.UUID) (models.Campaign, int, error) {
	return campaignSvc.repo.GetCampaign(campaignId)
}

func (campaignSvc *CampaignSvc) GetAllCampaigns(userId uuid.UUID) ([]models.Campaign, int, error) {
	return campaignSvc.repo.GetAllCampaigns(userId)
}

func (campaignSvc *CampaignSvc) DeleteCampaign(campaignId uuid.UUID) (int, error) {
	return campaignSvc.repo.DeleteCampaign(campaignId)
}

func (campaignSvc *CampaignSvc) GetSubscribers(campaignId uuid.UUID) ([]models.Subscriber, int, error) {
	return campaignSvc.repo.GetSubscribers(campaignId)
}