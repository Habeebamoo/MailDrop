package repositories

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CampaignRepository interface {
	CreateCampaign(models.Campaign) (int, error)
	GetCampaign(uuid.UUID) (models.Campaign, int, error)
}

type CampaignRepo struct {
	db *gorm.DB
}

func NewCampaignRepository(db *gorm.DB) CampaignRepository {
	return &CampaignRepo{db: db}
}

func (campaignRepo *CampaignRepo) CreateCampaign(campaign models.Campaign) (int, error) {
	//create the campaign
	if err := campaignRepo.db.Create(&campaign).Error; err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			return http.StatusNotAcceptable, fmt.Errorf("campaign title already exists")
		}
		return 500, fmt.Errorf("internal server error")
	}

	//get the campaign id and update the slug
	var createdCampaign models.Campaign
	err := campaignRepo.db.First(&createdCampaign, "title = ?", campaign.Title).Error
	if err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	updatedSlug := fmt.Sprintf("https://maildrop.netlify.app/campaign/%s", createdCampaign.CampaignId)

	//update the campaign
	if err := campaignRepo.db.Model(&models.Campaign{}).Update("slug", updatedSlug).Error; err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
}

func (campaignRepo *CampaignRepo) GetCampaign(campaignId uuid.UUID) (models.Campaign, int, error) {
	var campaign models.Campaign
	err := campaignRepo.db.First(&campaign, "campaign_id = ?", campaignId).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.Campaign{}, http.StatusNotFound, fmt.Errorf("campaign not found")
		}
		return models.Campaign{}, 500, fmt.Errorf("internal server error")
	}
	
	return campaign, 200, nil
}