package handlers

import (
	"fmt"
	"net/http"

	"github.com/Habeebamoo/MailDrop/server/internal/models"
	"github.com/Habeebamoo/MailDrop/server/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/gocarina/gocsv"
	"github.com/google/uuid"
)

type CampaignHandler struct {
	svc  service.CampaignService
}

func NewCampaignHandler(svc service.CampaignService) CampaignHandler {
	return CampaignHandler{svc: svc}
}

func (campaignHdl *CampaignHandler) CreateCampaign(c *gin.Context) {
	campaignReq := &models.CampaignRequest{}
	if err := c.ShouldBindJSON(&campaignReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := campaignReq.ValidateCampaignRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	statusCode, err := campaignHdl.svc.CreateCampaign(campaignReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	c.JSON(statusCode, gin.H{"message": "Campaign Created Successfully"})
}

func (campaignHdl *CampaignHandler) GetCampaign(c *gin.Context) {
	campaignIdStr := c.Param("id")
	if campaignIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campaign id is missing"})
		return
	}

	campaignId, _ := uuid.Parse(campaignIdStr)

	campaign, statusCode, err := campaignHdl.svc.GetCampaign(campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, campaign)
}

func (campaignHdl *CampaignHandler) GetAllCampaigns(c *gin.Context) {
	userIdStr := c.Query("userId")
	if userIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User id is missing"})
		return
	}

	userId, _ := uuid.Parse(userIdStr)

	campaigns, statusCode, err := campaignHdl.svc.GetAllCampaigns(userId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, campaigns)
}

func (campaignHdl *CampaignHandler) GetSubscribers(c *gin.Context) {
	campaignIdStr := c.Param("id")
	if campaignIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campaign id is missing"})
		return
	}

	campaignId, _ := uuid.Parse(campaignIdStr)

	subscribers, statusCode, err := campaignHdl.svc.GetSubscribers(campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, subscribers)
}

func (campaignHdl *CampaignHandler) CreateSubscriber(c *gin.Context) {
	subscriber := &models.SubscriberRequest{}
	if err := c.ShouldBindJSON(&subscriber); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := subscriber.ValidateSubscriberRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	userId, _ := uuid.Parse(subscriber.UserId)
	campaignId, _ := uuid.Parse(subscriber.CampaignId)

	msg, statusCode, err := campaignHdl.svc.CreateSubscriber(subscriber, userId, campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{"message": msg})
}

func (campaignHdl *CampaignHandler) GetSubscriberCampaign(c *gin.Context) {
	campaignIdStr := c.Param("id")
	if campaignIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campaign id is missing"})
		return
	}

	campaignId, _ := uuid.Parse(campaignIdStr)

	campaign, statusCode, err := campaignHdl.svc.GetSubscriberCampaign(campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, campaign)
}

func (campaignHdl *CampaignHandler) DownloadSubscribers(c *gin.Context) {
	campaignIdStr := c.Param("id")
	if campaignIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campaign id is missing."})
		return
	}

	campaignId, _ := uuid.Parse(campaignIdStr)
	campaign, subscribers, statusCode, err := campaignHdl.svc.DownloadSubscribers(campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	var subscribersCsv []*models.SubscribersCsv
	for _, u := range subscribers {
		subscribersCsv = append(subscribersCsv, &models.SubscribersCsv{
			Name: u.Name,
			Email: u.Email,
		})
	}

	fileName := fmt.Sprintf("%s_subscribers.csv", campaign.Title)
	headerValue := fmt.Sprintf("attachment; filename=%s", fileName)

	c.Header("Content-Disposition", headerValue)
	c.Header("Content-Type", "text/csv")

	err = gocsv.Marshal(subscribersCsv, c.Writer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create csv"})
		return
	}
}

func (campaignHdl *CampaignHandler) CampaignClick(c *gin.Context) {
	campaignIdStr := c.Param("id")
	campaignId, _ := uuid.Parse(campaignIdStr)

	statusCode, err := campaignHdl.svc.CampaignClick(campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": err.Error()})
		return
	}

	c.JSON(statusCode, gin.H{"message": "New Click"})
}

func (campaignHdl *CampaignHandler) DeleteCampaign(c *gin.Context) {
	campaignIdStr := c.Param("id")
	if campaignIdStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Campaign id is missing"})
		return
	}
	
	campaignId, _ := uuid.Parse(campaignIdStr)

	statusCode, err := campaignHdl.svc.DeleteCampaign(campaignId)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	c.JSON(statusCode, gin.H{"message": "Campaign has been deleted"})
}

func (campaignHdl *CampaignHandler) SendMail(c *gin.Context) {
	emailReq := &models.EmailRequest{}
	if err := c.ShouldBindJSON(&emailReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := emailReq.ValidateEmailRequest(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}

	statusCode, err := campaignHdl.svc.SendMail(emailReq)
	if err != nil {
		c.JSON(statusCode, gin.H{"error": Capitalize(err.Error(), false)})
		return
	}
	
	c.JSON(statusCode, gin.H{"message": "Emails sent successfully"})
}