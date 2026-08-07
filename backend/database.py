from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Boolean
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

    # Hashed password is stored here
    password = Column(
        String,
        nullable=False
    )

    # False until email OTP is verified
    verified = Column(
        Boolean,
        default=False
    )

    # Registration OTP
    verification_otp = Column(
        String,
        nullable=True
    )

    # Forgot password OTP
    reset_otp = Column(
        String,
        nullable=True
    )

    # True after reset OTP is successfully verified
    reset_verified = Column(
        Boolean,
        default=False
    )


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(
    bind=engine
)