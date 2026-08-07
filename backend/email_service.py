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

def send_otp_email(
    recipient_email,
    otp,
    purpose
):

    # --------------------------------------------------------
    # REGISTRATION OTP
    # --------------------------------------------------------

    if purpose == "registration":

        subject = (
            "AgriSense X Pro - "
            "Email Verification OTP"
        )

        body = f"""
Hello,

Welcome to AgriSense X Pro.

Your email verification OTP is:

{otp}

Enter this OTP in the AgriSense X Pro
application to complete your registration.

This OTP does not expire.

Regards,
AgriSense X Pro Team
"""


    # --------------------------------------------------------
    # PASSWORD RESET OTP
    # --------------------------------------------------------

    elif purpose == "reset":

        subject = (
            "AgriSense X Pro - "
            "Password Reset OTP"
        )

        body = f"""
Hello,

We received a request to reset your
AgriSense X Pro password.

Your password reset OTP is:

{otp}

Enter this OTP in the application
to reset your password.

This OTP does not expire.

If you did not request this,
you can safely ignore this email.

Regards,
AgriSense X Pro Team
"""


    else:

        raise ValueError(
            "Invalid email purpose."
        )


    # ========================================================
    # CREATE EMAIL
    # ========================================================

    message = EmailMessage()

    message["Subject"] = subject

    message["From"] = EMAIL_USER

    message["To"] = recipient_email

    message.set_content(body)


    # ========================================================
    # SEND THROUGH GMAIL
    # ========================================================

    with smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    ) as smtp:

        smtp.login(
            EMAIL_USER,
            EMAIL_PASSWORD
        )

        smtp.send_message(message)