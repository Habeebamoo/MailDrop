package repositories

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CampaignRepository interface {
	CreateCampaign(models.Campaign, uuid.UUID) (int, error)
	GetCampaign(uuid.UUID) (models.Campaign, int, error)
	GetAllCampaigns(uuid.UUID) ([]models.CampaignResponse, int, error)
	DeleteCampaign(models.Campaign) (int, error)
	SubscriberExist(string) bool
	GetSubscribers(uuid.UUID) ([]models.Subscriber, int, error)
	CreateSubscriber(models.Subscriber, uuid.UUID, uuid.UUID, string) (int, error)
}

type CampaignRepo struct {
	db *gorm.DB
}

func NewCampaignRepository(db *gorm.DB) CampaignRepository {
	return &CampaignRepo{db: db}
}

func (campaignRepo *CampaignRepo) CreateCampaign(campaign models.Campaign, userId uuid.UUID) (int, error) {
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

	updatedSlug := fmt.Sprintf("https://maildrop.netlify.app/campaign?id=%s", createdCampaign.CampaignId)

	//update the campaign
	if err := campaignRepo.db.Model(&models.Campaign{}).Where("user_id = ?", createdCampaign.UserId).Update("slug", updatedSlug).Error; err != nil {
		return 500, fmt.Errorf("internal server error")
	}

	//create the activity
	activityName := fmt.Sprintf("Created '%s' campaign", strings.TrimSpace(campaign.Title))

	activity := models.Activity{
		UserId: userId,
		Name: activityName,
		Type: "campaign",
		CreatedAt: time.Now(),
	}

	err = campaignRepo.db.Create(&activity).Error
	if err != nil {
		return 500, fmt.Errorf("failed to create user activity")
	}

	//update the user profile
	err = campaignRepo.db.
			Model(&models.Profile{}).
			Where("user_id = ?", campaign.UserId).
			UpdateColumn("total_campaigns", gorm.Expr("total_campaigns + ?", 1)).Error

	if err != nil {
		return 500, fmt.Errorf("failed to update user profile")
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

func (campaignRepo *CampaignRepo) GetAllCampaigns(userId uuid.UUID) ([]models.CampaignResponse, int, error) {
	var campaigns []models.Campaign
	err := campaignRepo.db.Find(&campaigns, "user_id = ?", userId).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return []models.CampaignResponse{}, http.StatusNotFound, fmt.Errorf("you haven't created any campaigns")
		}
		return []models.CampaignResponse{}, 500, fmt.Errorf("internal server error")
	}

	response := make([]models.CampaignResponse, len(campaigns))
	
	for i, campaign := range campaigns {
		response[i] = models.CampaignResponse{
			UserId: campaign.UserId,
			CampaignId: campaign.CampaignId,
			Title: campaign.Title,
			Description: campaign.Description,
			LeadMagnetUrl: campaign.LeadMagnetUrl,
			Slug: campaign.Slug,
			TotalSubscribers: campaign.TotalSubscribers,
			TotalClicks: campaign.TotalClicks,
			TotalEmails: campaign.TotalEmails,
			CreatedAt: campaign.CreatedAt.Format("Jan 2, 2006"),
		}
	}

	return response, 200, nil
}

func (campaignRepo *CampaignRepo) DeleteCampaign(campaign models.Campaign) (int, error) {
	//delete campaign
	res := campaignRepo.db.Where("campaign_id = ?", campaign.CampaignId).Delete(&models.Campaign{})
	if res.RowsAffected == 0 {
		return 500, fmt.Errorf("failed to delete campaign")
	}

	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}

	//update user profile
	err := campaignRepo.db.Model(&models.Profile{}).
									Where("user_id = ?", campaign.UserId).
									UpdateColumn("total_campaigns", gorm.Expr("total_campaigns - ?", 1)).Error
	if err != nil {
		return 500, fmt.Errorf("failed to update user profile")
	}	
	
	//create the activity
	activityName := fmt.Sprintf("Deleted '%s' campaign", strings.TrimSpace(campaign.Title))

	activity := models.Activity{
		UserId: campaign.UserId,
		Name: activityName,
		Type: "campaign",
		CreatedAt: time.Now(),
	}

	err = campaignRepo.db.Create(&activity).Error
	if err != nil {
		return 500, fmt.Errorf("failed to create user activity")
	}

	return 200, nil
}

func (campaignRepo *CampaignRepo) GetSubscribers(campaignId uuid.UUID) ([]models.Subscriber, int, error) {
	var subscribers []models.Subscriber
	if err := campaignRepo.db.Find(&subscribers, "campaign_id = ?", campaignId).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return []models.Subscriber{}, http.StatusNotFound, fmt.Errorf("this campaign has no subscribers")
		}
		return []models.Subscriber{}, 500, fmt.Errorf("internal server error")
	}

	return subscribers, 200, nil
}

func (campaignRepo *CampaignRepo) SubscriberExist(email string) bool {
	var subscriber models.Subscriber
	err := campaignRepo.db.Where("email = ?", subscriber.Email).First(&subscriber).Error

	if err == gorm.ErrRecordNotFound {
		return false
	} else {
		return true
	}
}

func (campaignRepo *CampaignRepo) CreateSubscriber(subscriber models.Subscriber, userId uuid.UUID, campaignId uuid.UUID, campaignName string) (int, error) {
	//create the subscriber
	err := campaignRepo.db.Create(&subscriber).Error
	if err != nil {
		return 500, fmt.Errorf("failed to subscribe")
	}

	//update the user & campaign
	err = campaignRepo.db.Model(&models.Profile{}).
									Where("user_id = ?", userId).
									UpdateColumn("total_subscribers", gorm.Expr("total_subscribers + ?", 1)).
									Error
	if err != nil {
		return 500, fmt.Errorf("failed to update user profile")
	}

	err = campaignRepo.db.Model(&models.Campaign{}).
												Where("campaign_id = ?", campaignId).
												UpdateColumn("total_subscribers", gorm.Expr("total_subscribers + ?", 1)).
												Error
	if err != nil {
		return 500, fmt.Errorf("failed to update campaign")
	}

	//create the actvity
	activityName := fmt.Sprintf("%s campaign has a new subscriber", strings.TrimSpace(campaignName))

	activity := models.Activity{
		UserId: userId,
		Name: activityName,
		Type: "campaign",
		CreatedAt: time.Now(),
	}

	err = campaignRepo.db.Create(&activity).Error
	if err != nil {
		return 500, fmt.Errorf("failed to create user activity")
	}

	return 200, nil
}