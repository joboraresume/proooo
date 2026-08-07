from fastapi import (
    FastAPI,
    Depends,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from pydantic import (
    BaseModel,
    EmailStr
)


# ============================================================
# OUR OWN FILES
# ============================================================

from database import (
    SessionLocal,
    User
)

from database import Base, engine

from auth import (
    hash_password,
    verify_password,
    generate_otp
)

from email_service import (
    send_otp_email
)


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="AgriSense X Pro API"
)


# ============================================================
# CORS
# Allows React frontend to communicate with Python backend
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


# ============================================================
# TEST ROUTE
# ============================================================

@app.get("/")
def home():

    return {
        "message":
        "AgriSense X Pro Backend Running"
    }


# ============================================================
# REQUEST MODELS
# ============================================================


class RegisterRequest(BaseModel):

    name: str

    phone: str

    email: EmailStr

    password: str


class VerifyRegistrationRequest(BaseModel):

    email: EmailStr

    otp: str


class LoginRequest(BaseModel):

    identifier: str

    password: str


class ForgotPasswordRequest(BaseModel):

    email: EmailStr


class VerifyResetOTPRequest(BaseModel):

    email: EmailStr

    otp: str


class ResetPasswordRequest(BaseModel):

    email: EmailStr

    new_password: str


# ============================================================
# REGISTER - SEND OTP
# ============================================================

@app.post(
    "/api/auth/register/send-otp"
)
def register_send_otp(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    email = request.email.lower().strip()

    phone = request.phone.strip()


    # --------------------------------------------------------
    # BASIC VALIDATION
    # --------------------------------------------------------

    if len(request.password) < 6:

        raise HTTPException(
            status_code=400,
            detail=
            "Password must contain at least 6 characters."
        )


    if not phone.isdigit() or len(phone) != 10:

        raise HTTPException(
            status_code=400,
            detail=
            "Phone number must contain exactly 10 digits."
        )


    # --------------------------------------------------------
    # CHECK EXISTING EMAIL
    # --------------------------------------------------------

    existing_email = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )


    if (
        existing_email
        and existing_email.verified
    ):

        raise HTTPException(
            status_code=400,
            detail=
            "This email is already registered."
        )


    # --------------------------------------------------------
    # CHECK EXISTING PHONE
    # --------------------------------------------------------

    existing_phone = (
        db.query(User)
        .filter(
            User.phone == phone
        )
        .first()
    )


    if (
        existing_phone
        and existing_phone.verified
    ):

        raise HTTPException(
            status_code=400,
            detail=
            "This phone number is already registered."
        )


    # --------------------------------------------------------
    # GENERATE OTP
    # --------------------------------------------------------

    otp = generate_otp()


    # --------------------------------------------------------
    # IF UNVERIFIED ACCOUNT ALREADY EXISTS
    # UPDATE IT
    # --------------------------------------------------------

    if existing_email:

        user = existing_email

        user.name = request.name

        user.phone = phone

        user.password = hash_password(
            request.password
        )

        user.verification_otp = otp

        user.verified = False


    else:

        user = User(

            name=request.name,

            phone=phone,

            email=email,

            password=hash_password(
                request.password
            ),

            verified=False,

            verification_otp=otp

        )

        db.add(user)


    db.commit()


    # --------------------------------------------------------
    # SEND OTP TO EMAIL
    # --------------------------------------------------------

    try:

        send_otp_email(
            email,
            otp,
            "registration"
        )

    except Exception as error:

        print(
            "EMAIL ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=
            "Could not send OTP email. "
            "Check your .env email settings."
        )


    return {

        "success": True,

        "message":
        "OTP sent to your registered email."

    }


# ============================================================
# REGISTER - VERIFY OTP
# ============================================================

@app.post(
    "/api/auth/register/verify-otp"
)
def verify_registration_otp(
    request: VerifyRegistrationRequest,
    db: Session = Depends(get_db)
):

    email = request.email.lower().strip()


    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail=
            "Registration account not found."
        )


    if user.verified:

        raise HTTPException(
            status_code=400,
            detail=
            "This account is already verified."
        )


    # --------------------------------------------------------
    # CHECK OTP
    # NO TIME LIMIT
    # --------------------------------------------------------

    if (
        not user.verification_otp
        or
        user.verification_otp != request.otp
    ):

        raise HTTPException(
            status_code=400,
            detail=
            "Incorrect OTP."
        )


    # --------------------------------------------------------
    # VERIFY ACCOUNT
    # --------------------------------------------------------

    user.verified = True

    user.verification_otp = None


    db.commit()


    return {

        "success": True,

        "message":
        "Account created successfully."

    }


# ============================================================
# LOGIN
# Email OR Phone + Password
# ============================================================

@app.post(
    "/api/auth/login"
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    identifier = request.identifier.strip()


    # --------------------------------------------------------
    # FIND USER BY EMAIL OR PHONE
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            (
                User.email ==
                identifier.lower()
            )
            |
            (
                User.phone ==
                identifier
            )
        )
        .first()
    )


    # --------------------------------------------------------
    # USER NOT FOUND
    # --------------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=401,
            detail=
            "No account found with this email or phone number."
        )


    # --------------------------------------------------------
    # EMAIL NOT VERIFIED
    # --------------------------------------------------------

    if not user.verified:

        raise HTTPException(
            status_code=401,
            detail=
            "Please verify your email before logging in."
        )


    # --------------------------------------------------------
    # CHECK PASSWORD
    # --------------------------------------------------------

    if not verify_password(
        request.password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail=
            "Incorrect password."
        )


    # --------------------------------------------------------
    # LOGIN SUCCESS
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
        "Login successful.",

        "user": {

            "id": user.id,

            "name": user.name,

            "phone": user.phone,

            "email": user.email

        }

    }


# ============================================================
# FORGOT PASSWORD - SEND OTP
# ============================================================

@app.post(
    "/api/auth/forgot-password"
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):

    email = request.email.lower().strip()


    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail=
            "No registered account found with this email."
        )


    if not user.verified:

        raise HTTPException(
            status_code=400,
            detail=
            "Please verify your account first."
        )


    # --------------------------------------------------------
    # GENERATE RESET OTP
    # --------------------------------------------------------

    otp = generate_otp()


    user.reset_otp = otp

    user.reset_verified = False


    db.commit()


    # --------------------------------------------------------
    # SEND RESET OTP
    # --------------------------------------------------------

    try:

        send_otp_email(
            email,
            otp,
            "reset"
        )

    except Exception as error:

        print(
            "EMAIL ERROR:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=
            "Could not send reset OTP."
        )


    return {

        "success": True,

        "message":
        "Password reset OTP sent to your email."

    }


# ============================================================
# FORGOT PASSWORD - VERIFY OTP
# ============================================================

@app.post(
    "/api/auth/forgot-password/verify-otp"
)
def verify_reset_otp(
    request: VerifyResetOTPRequest,
    db: Session = Depends(get_db)
):

    email = request.email.lower().strip()


    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail=
            "User not found."
        )


    # --------------------------------------------------------
    # CHECK OTP
    # NO TIME LIMIT
    # --------------------------------------------------------

    if (
        not user.reset_otp
        or
        user.reset_otp != request.otp
    ):

        raise HTTPException(
            status_code=400,
            detail=
            "Incorrect OTP."
        )


    user.reset_verified = True

    db.commit()


    return {

        "success": True,

        "message":
        "OTP verified successfully."

    }


# ============================================================
# RESET PASSWORD
# ============================================================

@app.post(
    "/api/auth/reset-password"
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):

    email = request.email.lower().strip()


    if len(request.new_password) < 6:

        raise HTTPException(
            status_code=400,
            detail=
            "Password must contain at least 6 characters."
        )


    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail=
            "User not found."
        )


    # --------------------------------------------------------
    # OTP MUST HAVE BEEN VERIFIED
    # --------------------------------------------------------

    if not user.reset_verified:

        raise HTTPException(
            status_code=400,
            detail=
            "Please verify the reset OTP first."
        )


    # --------------------------------------------------------
    # UPDATE PASSWORD
    # --------------------------------------------------------

    user.password = hash_password(
        request.new_password
    )

    user.reset_otp = None

    user.reset_verified = False


    db.commit()


    return {

        "success": True,

        "message":
        "Password changed successfully."

    }