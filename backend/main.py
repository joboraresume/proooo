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
    User,
    FarmerProfile,
    LandownerProfile,
    ForeignerProfile,
    WorkerProfile,
    AgricultureOfficerProfile,
    TerraceProfile
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
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175"
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
# FARMER PROFILE REQUEST
# ============================================================

class FarmerProfileRequest(BaseModel):

    user_id: int

    full_name: str

    phone: str

    email: str | None = None

    address: str | None = None

    experience: int | None = None

    farming_type: str | None = None



    irrigation_method: str | None = None

    farming_location: str | None = None


    # ============================================================
# LANDOWNER PROFILE REQUEST
# ============================================================

class LandownerProfileRequest(BaseModel):

    user_id: int

    full_name: str

    phone: str

    email: str | None = None

    address: str | None = None

    land_name: str

    survey_number: str

    district: str

    village: str

    area: float

    water_source: str | None = None

    # ============================================================
# FOREIGNER PROFILE REQUEST
# ============================================================

class ForeignerProfileRequest(BaseModel):

    user_id: int

    full_name: str

    nationality: str

    passport_number: str

    phone: str | None = None

    email: str | None = None

    address: str | None = None

    purpose: str | None = None

    land_location: str | None = None

    land_name: str | None = None

    survey_number: str | None = None

    district: str | None = None

    village: str | None = None

    area: float | None = None

    water_source: str | None = None

    # ============================================================
# WORKER PROFILE REQUEST
# ============================================================

class WorkerProfileRequest(BaseModel):

    user_id: int

    full_name: str

    phone: str

    email: str | None = None

    address: str | None = None

    work_type: str

    experience: int | None = None

    preferred_location: str | None = None

    # ============================================================
# AGRICULTURE OFFICER PROFILE REQUEST
# ============================================================

class AgricultureOfficerProfileRequest(BaseModel):

    user_id: int

    full_name: str

    employee_id: str

    department: str

    designation: str | None = None

    phone: str

    email: str | None = None

    district: str

    office_address: str | None = None

    # ============================================================
# TERRACE FARMING PROFILE REQUEST
# ============================================================

class TerraceProfileRequest(BaseModel):

    user_id: int

    terrace_type: str

    name: str

    location: str

    area: float

    crop: str

    number_of_plants: int | None = None

    water_source: str | None = None


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
# ============================================================
# GET USER ROLE STATUS
# ============================================================

@app.get("/api/profiles/{user_id}")
def get_user_profiles(
    user_id: int,
    db: Session = Depends(get_db)
):

    farmer = (
        db.query(FarmerProfile)
        .filter(
            FarmerProfile.user_id == user_id
        )
        .first()
    )

    landowner = (
        db.query(LandownerProfile)
        .filter(
            LandownerProfile.user_id == user_id
        )
        .first()
    )

    foreigner = (
        db.query(ForeignerProfile)
        .filter(
            ForeignerProfile.user_id == user_id
        )
        .first()
    )

    worker = (
        db.query(WorkerProfile)
        .filter(
            WorkerProfile.user_id == user_id
        )
        .first()
    )

    agriculture_officer = (
        db.query(AgricultureOfficerProfile)
        .filter(
            AgricultureOfficerProfile.user_id == user_id
        )
        .first()
    )

    terrace = (
        db.query(TerraceProfile)
        .filter(
            TerraceProfile.user_id == user_id
        )
        .first()
    )

    return {

        "farmer": farmer is not None,

        "landowner": landowner is not None,

        "foreigner": foreigner is not None,

        "worker": worker is not None,

        "agriculture_officer":
            agriculture_officer is not None,

        "terrace":
            terrace is not None
    }
# ============================================================
# CREATE FARMER PROFILE
# ============================================================

@app.post("/api/profiles/farmer")
def create_farmer_profile(
    request: FarmerProfileRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # CHECK WHETHER USER EXISTS
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # --------------------------------------------------------
    # CHECK WHETHER FARMER PROFILE ALREADY EXISTS
    # --------------------------------------------------------

    existing = (
        db.query(FarmerProfile)
        .filter(
            FarmerProfile.user_id ==
            request.user_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Farmer profile already exists."
        )

    # --------------------------------------------------------
    # CREATE FARMER PROFILE
    # --------------------------------------------------------

    profile = FarmerProfile(

        user_id=request.user_id,

        full_name=request.full_name,

        phone=request.phone,

        email=request.email,

        address=request.address,

        experience=request.experience,

        farming_type=request.farming_type,



        irrigation_method=
            request.irrigation_method,

        farming_location=
            request.farming_location
    )

    # --------------------------------------------------------
    # SAVE TO DATABASE
    # --------------------------------------------------------

    db.add(profile)

    db.commit()

    db.refresh(profile)

    return {

        "success": True,

        "message":
            "Farmer registration completed.",

        "role":
            "farmer"
    }
# ============================================================
# DELETE FARMER PROFILE
# ============================================================

@app.delete("/api/profiles/farmer/{user_id}")
def delete_farmer_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # FIND FARMER PROFILE
    # --------------------------------------------------------

    profile = (
        db.query(FarmerProfile)
        .filter(
            FarmerProfile.user_id == user_id
        )
        .first()
    )

    # --------------------------------------------------------
    # IF NOT FOUND
    # --------------------------------------------------------

    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Farmer profile not found."
        )

    # --------------------------------------------------------
    # DELETE PROFILE
    # --------------------------------------------------------

    db.delete(profile)

    db.commit()

    return {

        "success": True,

        "message":
            "Farmer profile deleted."
    }
# ============================================================
# CREATE LANDOWNER PROFILE
# ============================================================

@app.post("/api/profiles/landowner")
def create_landowner_profile(
    request: LandownerProfileRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    existing = (
        db.query(LandownerProfile)
        .filter(
            LandownerProfile.user_id ==
            request.user_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail=
            "Landowner profile already exists."
        )

    profile = LandownerProfile(

        user_id=request.user_id,

        full_name=request.full_name,

        phone=request.phone,

        email=request.email,

        address=request.address,

        land_name=request.land_name,

        survey_number=request.survey_number,

        district=request.district,

        village=request.village,

        area=request.area,

        water_source=request.water_source
    )

    db.add(profile)

    db.commit()

    db.refresh(profile)

    return {

        "success": True,

        "message":
            "Landowner registration completed.",

        "role":
            "landowner"
    }

# ============================================================
# DELETE LANDOWNER PROFILE
# ============================================================

@app.delete("/api/profiles/landowner/{user_id}")
def delete_landowner_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = (
        db.query(LandownerProfile)
        .filter(
            LandownerProfile.user_id == user_id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail=
            "Landowner profile not found."
        )

    db.delete(profile)

    db.commit()

    return {

        "success": True,

        "message":
            "Landowner profile deleted."
    }

# ============================================================
# CREATE FOREIGNER PROFILE
# ============================================================

@app.post("/api/profiles/foreigner")
def create_foreigner_profile(
    request: ForeignerProfileRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    existing = (
        db.query(ForeignerProfile)
        .filter(
            ForeignerProfile.user_id ==
            request.user_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail=
            "Foreigner profile already exists."
        )

    profile = ForeignerProfile(

        user_id=request.user_id,

        full_name=request.full_name,

        nationality=request.nationality,

        passport_number=
            request.passport_number,

        phone=request.phone,

        email=request.email,

        address=request.address,

        purpose=request.purpose,

        land_location=request.land_location,

        land_name=request.land_name,

        survey_number=request.survey_number,

        district=request.district,

        village=request.village,

        area=request.area,

        water_source=request.water_source
    )

    db.add(profile)

    db.commit()

    db.refresh(profile)

    return {

        "success": True,

        "message":
            "Foreigner registration completed.",

        "role":
            "foreigner"
    }

# ============================================================
# DELETE FOREIGNER PROFILE
# ============================================================

@app.delete("/api/profiles/foreigner/{user_id}")
def delete_foreigner_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = (
        db.query(ForeignerProfile)
        .filter(
            ForeignerProfile.user_id == user_id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail=
            "Foreigner profile not found."
        )

    db.delete(profile)

    db.commit()

    return {

        "success": True,

        "message":
            "Foreigner profile deleted."
    }

# ============================================================
# CREATE WORKER PROFILE
# ============================================================

@app.post("/api/profiles/worker")
def create_worker_profile(
    request: WorkerProfileRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    existing = (
        db.query(WorkerProfile)
        .filter(
            WorkerProfile.user_id ==
            request.user_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail=
            "Worker profile already exists."
        )

    profile = WorkerProfile(

        user_id=request.user_id,

        full_name=request.full_name,

        phone=request.phone,

        email=request.email,

        address=request.address,

        work_type=request.work_type,

        experience=request.experience,

        preferred_location=
            request.preferred_location
    )

    db.add(profile)

    db.commit()

    db.refresh(profile)

    return {

        "success": True,

        "message":
            "Worker registration completed.",

        "role":
            "worker"
    }

# ============================================================
# DELETE WORKER PROFILE
# ============================================================

@app.delete("/api/profiles/worker/{user_id}")
def delete_worker_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = (
        db.query(WorkerProfile)
        .filter(
            WorkerProfile.user_id == user_id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail=
            "Worker profile not found."
        )

    db.delete(profile)

    db.commit()

    return {

        "success": True,

        "message":
            "Worker profile deleted."
    }

# ============================================================
# CREATE AGRICULTURE OFFICER PROFILE
# ============================================================

@app.post("/api/profiles/agriculture-officer")
def create_agriculture_officer_profile(
    request: AgricultureOfficerProfileRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    existing = (
        db.query(AgricultureOfficerProfile)
        .filter(
            AgricultureOfficerProfile.user_id ==
            request.user_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail=
            "Agriculture officer profile already exists."
        )

    profile = AgricultureOfficerProfile(

        user_id=request.user_id,

        full_name=request.full_name,

        employee_id=request.employee_id,

        department=request.department,

        designation=request.designation,

        phone=request.phone,

        email=request.email,

        district=request.district,

        office_address=
            request.office_address
    )

    db.add(profile)

    db.commit()

    db.refresh(profile)

    return {

        "success": True,

        "message":
            "Agriculture officer registration completed.",

        "role":
            "agriculture_officer"
    }

# ============================================================
# DELETE AGRICULTURE OFFICER PROFILE
# ============================================================

@app.delete(
    "/api/profiles/agriculture-officer/{user_id}"
)
def delete_agriculture_officer_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = (
        db.query(AgricultureOfficerProfile)
        .filter(
            AgricultureOfficerProfile.user_id ==
            user_id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail=
            "Agriculture officer profile not found."
        )

    db.delete(profile)

    db.commit()

    return {

        "success": True,

        "message":
            "Agriculture officer profile deleted."
    }

# ============================================================
# CREATE TERRACE FARMING PROFILE
# ============================================================

@app.post("/api/profiles/terrace")
def create_terrace_profile(
    request: TerraceProfileRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.id == request.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    existing = (
        db.query(TerraceProfile)
        .filter(
            TerraceProfile.user_id ==
            request.user_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail=
            "Terrace farming profile already exists."
        )

    profile = TerraceProfile(

        user_id=request.user_id,

        terrace_type=request.terrace_type,

        name=request.name,

        location=request.location,

        area=request.area,

        crop=request.crop,

        number_of_plants=
            request.number_of_plants,

        water_source=request.water_source
    )

    db.add(profile)

    db.commit()

    db.refresh(profile)

    return {

        "success": True,

        "message":
            "Terrace farming registration completed.",

        "role":
            "terrace"
    }

# ============================================================
# DELETE TERRACE FARMING PROFILE
# ============================================================

@app.delete("/api/profiles/terrace/{user_id}")
def delete_terrace_profile(
    user_id: int,
    db: Session = Depends(get_db)
):

    profile = (
        db.query(TerraceProfile)
        .filter(
            TerraceProfile.user_id == user_id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail=
            "Terrace farming profile not found."
        )

    db.delete(profile)

    db.commit()

    return {

        "success": True,

        "message":
            "Terrace farming profile deleted."
    }