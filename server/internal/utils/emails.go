package utils

import (
	"fmt"
	"os"
	"time"

	"gopkg.in/gomail.v2"
)

func SendWelcomeEmail() {

}

func SendVerificationEmail() {

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
							<p>Hello %s</p>
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