import random
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError


# ============================================================
# PASSWORD HASHING
# ============================================================

password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    """
    Securely hash a password before storing it in the database.
    """
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    """
    Check whether the entered password matches
    the stored password hash.
    """

    try:
        return password_hasher.verify(
            hashed_password,
            password
        )

    except VerifyMismatchError:
        return False

    except Exception:
        return False


# ============================================================
# OTP GENERATION
# ============================================================

def generate_otp() -> str:
    """
    Generate a 6-digit OTP.
    """

    return str(random.randint(100000, 999999))