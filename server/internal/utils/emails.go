package utils

import (
	"fmt"
	"os"
	"strings"
	"time"

	"gopkg.in/gomail.v2"
)

func ResendVerificationEmail(name, email string, otp int) error {
	m := gomail.NewMessage()

	m.SetHeader("From", m.FormatAddress("habeebfrommaildrop@gmail.com", "MailDrop"))
	m.SetHeader("To", email)
	m.SetHeader("Subject", "OTP Verification")

	verificationUrl := fmt.Sprintf("https://maildrop.netlify.app/verify?code=%d", otp)

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
				<table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
					<tr>
						<td>
							<table align="center" cellpadding="0" cellspacing="0" width="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
								<tr>
									<td style="background: #231e88; padding: 20px; text-align: center;">
										<h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
									</td>
								</tr>
								<tr>
									<td style="padding: 30px; color: #333;">
										<p style="font-size: 16px;">Hi %s,</p>
										<p style="font-size: 16px; line-height: 1.5;">We receive a request to verify your email address, click on the link below to proceed</p>
										<p style="text-align: center; padding: 30px 0;">
											<a href="%s" style="background-color: #231e88; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Verify my account</a>
										</p>
										<p style="font-size: 14px; line-height: 1.5; color: #555;">This OTP is valid for <strong>10 minutes</strong>. If you didn't create an account, you can ignore this email</p>
									</td>
								</tr>
								<tr>
									<td style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777;">
										&copy; %d MailDrop. All right reserved.
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`, name, verificationUrl, time.Now().Year())
	
	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "habeebfrommaildrop@gmail.com", os.Getenv("GOOGLE_APP_PASS"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send mail")
	} 

	return nil
}

func SendVerificationEmail(name, email string, otp int) error {
	m := gomail.NewMessage()

	m.SetHeader("From", m.FormatAddress("habeebfrommaildrop@gmail.com", "MailDrop"))
	m.SetHeader("To", email)
	m.SetHeader("Subject", "OTP Verification")

	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
				<table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
					<tr>
						<td>
							<table align="center" cellpadding="0" cellspacing="0" width="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
								<tr>
									<td style="background: #231e88; padding: 20px; text-align: center;">
										<h1 style="color: #ffffff; margin: 0;">Verify Your Email</h1>
									</td>
								</tr>
								<tr>
									<td style="padding: 30px; color: #333;">
										<p style="font-size: 16px;">Hi %s,</p>
										<p style="font-size: 16px; line-height: 1.5;">Thank you for signing up. Please verify your email address by entering the 6 digits code below</p>
										<p style="text-align: center; padding: 30px 0; font-size: 28px;">
											%d
										</p>
										<p style="font-size: 14px; line-height: 1.5; color: #555;">This OTP is valid for <strong>10 minutes</strong>. If you didn't create an account, you can ignore this email</p>
									</td>
								</tr>
								<tr>
									<td style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777;">
										&copy; %d MailDrop. All right reserved.
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`, name, otp, time.Now().Year())
	
	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "habeebfrommaildrop@gmail.com", os.Getenv("GOOGLE_APP_PASS"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send mail")
	} 

	return nil
}

func SendPasswordResetEmail(name, email, token string) (int, error) {
	m := gomail.NewMessage()
	resetUrl := fmt.Sprintf("https://maildrop.netlify.app/reset?token=%s", token)

	m.SetHeader("From", m.FormatAddress("habeebfrommaildrop@gmail.com", "Habeeb from MailDrop"))
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Reset your Password")

	//Email body (HTML)
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html lang="en">
			<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px; margin: 0;">
				<table width="100%%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
					<tr>
						<td style="background-color: #231e88; padding: 20px; text-align: center;">
							<h1 style="color: #ffffff; margin: 0;">Password Reset</h1>
						</td>
					</tr>
					<tr>
						<td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
							<p>Hello %s,</p>
							<p>We received a request to reset your password. Click the button below to proceed</p>
							<p style="text-align: center; margin: 30px 0;">
								<a href="%s" style="background-color: #231e88; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Reset Password</a>
							</p>
							<p>If you did not request this, you can safely ignore this email</p>
							<p>Thank you,<br> The Team</p>
						</td>
					</tr>
					<tr>
						<td style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 14px; color: #888888;">
							<p>&copy; %v MailDrop. All right reserved</p>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`, name, resetUrl, time.Now().Year())

	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "habeebfrommaildrop@gmail.com", os.Getenv("GOOGLE_APP_PASS"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return 500, fmt.Errorf("failed to send mail")
	} 

	return 200, nil
}

func SendRewardEmail(name, email, campaignTitle, rewardurl string) (int, error) {
	m := gomail.NewMessage()

	m.SetHeader("From", m.FormatAddress("habeebfrommaildrop@gmail.com", "MailDrop"))
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Your Reward Is Here")

	//Email body (HTML)
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
			<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
				<table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
					<tr>
						<td>
							<table align="center" cellpadding="0" cellspacing="0" width="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
								<tr>
									<td style="background: #231e88; padding: 20px; text-align: center;">
										<h1 style="color: #ffffff; margin: 0;">Thank You For Subscribing</h1>
									</td>
								</tr>
								<tr>
									<td style="padding: 30px; color: #333;">
										<p style="font-size: 16px;">Hi %s,</p>
										<p style="font-size: 16px; line-height: 1.5;">We're excited to share your exclusive reward with you for subscribing at <b>%s</b> campaign. Click the link below to get your copy</p>
										<p style="text-align: center; padding: 30px 0;">
											<a href="%s" style="background-color: #231e88; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Mine</a>
										</p>
										<p style="font-size: 14px; line-height: 1.5; color: #555;">If you have any questions, feel free to reply to this email. We are here to help!</p>
									</td>
								</tr>
								<tr>
									<td style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777;">
										&copy; %d MailDrop. All right reserved.
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>
		</html>
	`, Capitalize(name, false), strings.TrimSpace(campaignTitle), rewardurl, time.Now().Year())

	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "habeebfrommaildrop@gmail.com", os.Getenv("GOOGLE_APP_PASS"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return 500, fmt.Errorf("failed to send mail")
	} 

	return 200, nil
}

func SendPromotionalEmail(emailJob EmailJobs) error {
	m := gomail.NewMessage()

	m.SetHeader("From", m.FormatAddress("habeebfrommaildrop@gmail.com", emailJob.SenderName))
	m.SetHeader("To", emailJob.ReceiverEmail)
	m.SetHeader("Subject", emailJob.Subject)

	unsubscribeUrl := "https://maildrop.netlify.app"

	//Email body (HTML)
	body := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
			<body style="font-family: Arial, sans-serif; font-size: 28px; line-height: 1.5; background-color: #f4f4f4; margin: 0; padding: 0;">
				%s

				<section style="margin-top: 100px; text-align: center; font-size: 14px;">
					Built with MailDrop
					<a href="%s">Unsubscribe</a>
				</section>
			</body>
		</html>
	`, emailJob.Content, unsubscribeUrl)

	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 465, "habeebfrommaildrop@gmail.com", os.Getenv("GOOGLE_APP_PASS"))
	d.SSL = true

	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send mail")
	} 

	return nil
}