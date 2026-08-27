from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean,
    Float,
    ForeignKey
)

from sqlalchemy.orm import (
    declarative_base,
    sessionmaker
)


# ============================================================
# DATABASE CONNECTION
# ============================================================

DATABASE_URL = "sqlite:///./agrisense.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


# ============================================================
# USER TABLE
# ============================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    verified = Column(
        Boolean,
        default=False
    )

    verification_otp = Column(
        String,
        nullable=True
    )

    reset_otp = Column(
        String,
        nullable=True
    )

    reset_verified = Column(
        Boolean,
        default=False
    )


# ============================================================
# FARMER PROFILE
# ============================================================

class FarmerProfile(Base):

    __tablename__ = "farmer_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=True
    )

    address = Column(
        String,
        nullable=True
    )

    experience = Column(
        Integer,
        nullable=True
    )

    farming_type = Column(
        String,
        nullable=True
    )



    irrigation_method = Column(
        String,
        nullable=True
    )

    farming_location = Column(
        String,
        nullable=True
    )


# ============================================================
# LANDOWNER PROFILE
# ============================================================

class LandownerProfile(Base):

    __tablename__ = "landowner_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=True
    )

    address = Column(
        String,
        nullable=True
    )

    land_name = Column(
        String,
        nullable=False
    )

    survey_number = Column(
        String,
        nullable=False
    )

    district = Column(
        String,
        nullable=False
    )

    village = Column(
        String,
        nullable=False
    )

    area = Column(
        Float,
        nullable=False
    )

    water_source = Column(
        String,
        nullable=True
    )

    document_path = Column(
        String,
        nullable=True
    )


# ============================================================
# FOREIGNER PROFILE
# ============================================================

class ForeignerProfile(Base):

    __tablename__ = "foreigner_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    nationality = Column(
        String,
        nullable=False
    )

    passport_number = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        nullable=True
    )

    address = Column(
        String,
        nullable=True
    )

    purpose = Column(
        String,
        nullable=True
    )

    land_location = Column(
        String,
        nullable=True
    )

    land_name = Column(
        String,
        nullable=True
    )

    survey_number = Column(
        String,
        nullable=True
    )

    district = Column(
        String,
        nullable=True
    )

    village = Column(
        String,
        nullable=True
    )

    area = Column(
        Float,
        nullable=True
    )

    water_source = Column(
        String,
        nullable=True
    )


# ============================================================
# WORKER PROFILE
# ============================================================

class WorkerProfile(Base):

    __tablename__ = "worker_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    phone = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=True
    )

    address = Column(
        String,
        nullable=True
    )

    work_type = Column(
        String,
        nullable=False
    )

    experience = Column(
        Integer,
        nullable=True
    )

    preferred_location = Column(
        String,
        nullable=True
    )


# ============================================================
# AGRICULTURE OFFICER PROFILE
# ============================================================

class AgricultureOfficerProfile(Base):

    __tablename__ = "agriculture_officer_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    full_name = Column(
        String,
        nullable=False
    )

    employee_id = Column(
        String,
        nullable=False
    )

    department = Column(
        String,
        nullable=False
    )

    designation = Column(
        String,
        nullable=True
    )

    phone = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=True
    )

    district = Column(
        String,
        nullable=False
    )

    office_address = Column(
        String,
        nullable=True
    )


# ============================================================
# TERRACE FARMING PROFILE
# ============================================================

class TerraceProfile(Base):

    __tablename__ = "terrace_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    terrace_type = Column(
        String,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    area = Column(
        Float,
        nullable=False
    )

    crop = Column(
        String,
        nullable=False
    )

    number_of_plants = Column(
        Integer,
        nullable=True
    )

    water_source = Column(
        String,
        nullable=True
    )


# ============================================================
# CREATE ALL TABLES
# ============================================================

Base.metadata.create_all(
    bind=engine
)