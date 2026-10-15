import os
import smtplib

from email.message import EmailMessage
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


# ============================================================
# SEND EMAIL OTP
# ============================================================

def send_otp_email(recipient_email, otp, purpose):

    # --------------------------------------------------------
    # CHECK EMAIL SETTINGS
    # --------------------------------------------------------

    if not EMAIL_USER or not EMAIL_PASSWORD:
        print("====================================================")
        print("EMAIL CONFIGURATION ERROR")
        print("EMAIL_USER or EMAIL_PASSWORD is missing.")
        print("Check your .env file.")
        print("FOR TESTING ONLY - YOUR OTP IS:", otp)
        print("====================================================")
        raise RuntimeError(
            "EMAIL_USER or EMAIL_PASSWORD is missing in .env"
        )

    # --------------------------------------------------------
    # EMAIL CONTENT
    # --------------------------------------------------------

    if purpose == "registration":

        subject = "AgriSense X Pro - Email Verification OTP"

        body = f"""
Hello,

Welcome to AgriSense X Pro.

Your email verification OTP is:

{otp}

Enter this OTP in the AgriSense X Pro application
to complete your registration.

This OTP does not expire.

Regards,
AgriSense X Pro Team
"""

    elif purpose == "reset":

        subject = "AgriSense X Pro - Password Reset OTP"

        body = f"""
Hello,

We received a request to reset your AgriSense X Pro password.

Your password reset OTP is:

{otp}

Enter this OTP in the application to reset your password.

This OTP does not expire.

If you did not request this, you can safely ignore this email.

Regards,
AgriSense X Pro Team
"""

    else:
        raise ValueError("Invalid email purpose.")

    # --------------------------------------------------------
    # CREATE EMAIL
    # --------------------------------------------------------

    message = EmailMessage()

    message["Subject"] = subject
    message["From"] = EMAIL_USER
    message["To"] = recipient_email

    message.set_content(body)

    # --------------------------------------------------------
    # SEND THROUGH GMAIL
    # Port 587 + STARTTLS
    # --------------------------------------------------------

    try:

        print("====================================================")
        print("CONNECTING TO GMAIL SMTP...")
        print("FROM:", EMAIL_USER)
        print("TO:", recipient_email)
        print("====================================================")

        with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as smtp:

            smtp.ehlo()

            smtp.starttls()

            smtp.ehlo()

            smtp.login(
                EMAIL_USER,
                EMAIL_PASSWORD
            )

            smtp.send_message(message)

        print("====================================================")
        print("EMAIL SENT SUCCESSFULLY")
        print("TO:", recipient_email)
        print("====================================================")

        return True

    except Exception as error:

        print("====================================================")
        print("EMAIL SERVICE ERROR")
        print("ERROR:", error)
        print("====================================================")
        print("Possible causes:")
        print("1. Incorrect Gmail App Password")
        print("2. EMAIL_USER is incorrect")
        print("3. .env file is not being loaded")
        print("4. Gmail SMTP connection is blocked")
        print("5. Internet/firewall is blocking port 587")
        print("====================================================")
        print("FOR TESTING ONLY - YOUR OTP IS:", otp)
        print("====================================================")

        raise RuntimeError(
            f"Could not send OTP email: {error}"
        )
