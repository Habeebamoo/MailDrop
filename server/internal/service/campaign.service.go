package service

import (
	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/repositories"
	"github.com/google/uuid"
)

type CampaignService interface {
	CreateCampaign(models.CampaignRequest) (int, error)
	GetCampaign(uuid.UUID) (models.Campaign, int, error)
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
		LeadMagnet: campaignReq.LeadMagnet,
		LeadMagnetUrl: campaignReq.LeadMagnetUrl,
		Slug: "",
	}

	return campaignSvc.repo.CreateCampaign(campaign)
}

func (campaignSvc *CampaignSvc) GetCampaign(campaignId uuid.UUID) (models.Campaign, int, error) {
	return campaignSvc.repo.GetCampaign(campaignId)
}