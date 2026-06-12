from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Header
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import datetime, timedelta, timezone
from pathlib import Path
import os, uuid, jwt, time, hmac, hashlib, logging, asyncio

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGO = os.environ.get('JWT_ALGO', 'HS256')
ADMIN_EMAIL = os.environ['ADMIN_EMAIL']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
RAZORPAY_MOCK_MODE = os.environ.get('RAZORPAY_MOCK_MODE', 'true').lower() == 'true'

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI(title="Pritha API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("pritha")

# ===== Models =====
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class SignupReq(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str
    is_student: bool = False

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class GoogleReq(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None

class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    is_student: bool
    picture: Optional[str] = None
    created_at: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class DietRequestReq(BaseModel):
    name: str
    age: int
    gender: str
    height: float
    weight: float
    activity_level: str
    dietary_preference: str
    allergies: str = ""
    medical_conditions: str = ""
    goals: str
    is_student: bool

class JournalReq(BaseModel):
    mood: Literal["Great", "Good", "Okay", "Low", "Exhausted"]
    note: str = ""

class ConsultationReq(BaseModel):
    date: str  # ISO date
    time_slot: str
    notes: str = ""

class PayOrderReq(BaseModel):
    kind: Literal["diet_plan", "consultation"]
    ref_id: str  # diet request id or consultation id
    is_student: bool = False

class PayVerifyReq(BaseModel):
    order_id: str
    razorpay_payment_id: str = ""
    razorpay_signature: str = ""

class ChatReq(BaseModel):
    message: str
    session_id: str

class UploadPlanReq(BaseModel):
    pdf_base64: str  # base64 string of the PDF

# ===== Auth helpers =====
def hash_pw(p: str) -> str:
    return pwd_ctx.hash(p)

def verify_pw(p: str, h: str) -> bool:
    try:
        return pwd_ctx.verify(p, h)
    except Exception:
        return False

def make_token(uid: str, email: str, role: str) -> str:
    payload = {
        "sub": uid, "email": email, "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def get_user(authorization: Optional[str] = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return user

async def require_admin(user: dict = Depends(get_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin only")
    return user

def user_out(u: dict) -> UserOut:
    return UserOut(
        id=u["id"], email=u["email"], name=u["name"],
        role=u["role"], is_student=u.get("is_student", False),
        picture=u.get("picture"), created_at=u["created_at"],
    )

# ===== Routes =====
@api.get("/")
async def root():
    return {"app": "Pritha", "tagline": "Daughter of Earth"}

@api.post("/auth/signup", response_model=TokenOut)
async def signup(req: SignupReq):
    if await db.users.find_one({"email": req.email}):
        raise HTTPException(400, "Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid, "email": req.email, "name": req.name,
        "password_hash": hash_pw(req.password), "role": "user",
        "is_student": req.is_student, "picture": None,
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    u = await db.users.find_one({"id": uid}, {"_id": 0, "password_hash": 0})
    return TokenOut(access_token=make_token(uid, req.email, "user"), user=user_out(u))

@api.post("/auth/login", response_model=TokenOut)
async def login(req: LoginReq):
    u = await db.users.find_one({"email": req.email})
    if not u or not verify_pw(req.password, u.get("password_hash", "")):
        raise HTTPException(400, "Invalid credentials")
    u_clean = {k: v for k, v in u.items() if k not in ("_id", "password_hash")}
    return TokenOut(access_token=make_token(u["id"], u["email"], u["role"]), user=user_out(u_clean))

@api.post("/auth/google", response_model=TokenOut)
async def google_login(req: GoogleReq):
    """Mock Google OAuth - in production verify ID token."""
    u = await db.users.find_one({"email": req.email})
    if not u:
        uid = str(uuid.uuid4())
        doc = {
            "id": uid, "email": req.email, "name": req.name,
            "password_hash": "", "role": "user",
            "is_student": False, "picture": req.picture,
            "created_at": now_iso(), "provider": "google",
        }
        await db.users.insert_one(doc)
        u = doc
    u_clean = {k: v for k, v in u.items() if k not in ("_id", "password_hash")}
    return TokenOut(access_token=make_token(u["id"], u["email"], u["role"]), user=user_out(u_clean))

@api.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_user)):
    return user_out(user)

# ----- Diet Requests -----
@api.post("/diet-requests")
async def create_diet_request(req: DietRequestReq, user: dict = Depends(get_user)):
    rid = str(uuid.uuid4())
    price = 250 if req.is_student else 500
    doc = {
        "id": rid, "user_id": user["id"], "user_email": user["email"],
        "user_name": user["name"], **req.model_dump(),
        "price": price, "status": "pending", "payment_status": "unpaid",
        "plan_pdf_base64": None, "created_at": now_iso(),
    }
    await db.diet_requests.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api.get("/diet-requests/mine")
async def my_diet_requests(user: dict = Depends(get_user)):
    cur = db.diet_requests.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1)
    return await cur.to_list(100)

@api.get("/diet-requests/{rid}")
async def get_diet_request(rid: str, user: dict = Depends(get_user)):
    d = await db.diet_requests.find_one({"id": rid}, {"_id": 0})
    if not d:
        raise HTTPException(404, "Not found")
    if user["role"] != "admin" and d["user_id"] != user["id"]:
        raise HTTPException(403, "Forbidden")
    return d

# ----- Consultations -----
@api.post("/consultations")
async def create_consultation(req: ConsultationReq, user: dict = Depends(get_user)):
    cid = str(uuid.uuid4())
    doc = {
        "id": cid, "user_id": user["id"], "user_email": user["email"],
        "user_name": user["name"], **req.model_dump(),
        "price": 750, "status": "booked", "payment_status": "unpaid",
        "created_at": now_iso(),
    }
    await db.consultations.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api.get("/consultations/mine")
async def my_consultations(user: dict = Depends(get_user)):
    cur = db.consultations.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1)
    return await cur.to_list(100)

# ----- Journal -----
@api.post("/journal")
async def create_journal(req: JournalReq, user: dict = Depends(get_user)):
    jid = str(uuid.uuid4())
    doc = {"id": jid, "user_id": user["id"], **req.model_dump(), "created_at": now_iso()}
    await db.journal.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api.get("/journal/mine")
async def my_journal(user: dict = Depends(get_user)):
    cur = db.journal.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1)
    return await cur.to_list(200)

@api.delete("/journal/{jid}")
async def delete_journal(jid: str, user: dict = Depends(get_user)):
    r = await db.journal.delete_one({"id": jid, "user_id": user["id"]})
    if r.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}

# ----- Payments (Razorpay - MOCK MODE) -----
@api.post("/payments/order")
async def create_pay_order(req: PayOrderReq, user: dict = Depends(get_user)):
    if req.kind == "diet_plan":
        amount = 250 if req.is_student else 500
    else:
        amount = 750
    oid = f"order_mock_{int(time.time()*1000)}_{uuid.uuid4().hex[:6]}"
    doc = {
        "id": str(uuid.uuid4()), "order_id": oid, "user_id": user["id"],
        "kind": req.kind, "ref_id": req.ref_id, "amount": amount,
        "currency": "INR", "status": "created", "mock": RAZORPAY_MOCK_MODE,
        "created_at": now_iso(),
    }
    await db.payments.insert_one(doc)
    return {"order_id": oid, "amount": amount, "currency": "INR",
            "key_id": "rzp_mock_pritha", "mock_mode": RAZORPAY_MOCK_MODE}

@api.post("/payments/verify")
async def verify_pay(req: PayVerifyReq, user: dict = Depends(get_user)):
    pay = await db.payments.find_one({"order_id": req.order_id})
    if not pay:
        raise HTTPException(404, "Order not found")
    # MOCK: auto-verify. In production, verify HMAC signature.
    await db.payments.update_one(
        {"order_id": req.order_id},
        {"$set": {"status": "paid", "paid_at": now_iso(),
                  "razorpay_payment_id": req.razorpay_payment_id or f"pay_mock_{uuid.uuid4().hex[:10]}"}}
    )
    # Update linked entity
    coll = "diet_requests" if pay["kind"] == "diet_plan" else "consultations"
    await db[coll].update_one({"id": pay["ref_id"]}, {"$set": {"payment_status": "paid"}})
    return {"status": "paid", "order_id": req.order_id}

# ----- Admin -----
@api.get("/admin/stats")
async def admin_stats(_: dict = Depends(require_admin)):
    return {
        "users": await db.users.count_documents({"role": "user"}),
        "diet_pending": await db.diet_requests.count_documents({"status": "pending"}),
        "diet_completed": await db.diet_requests.count_documents({"status": "completed"}),
        "consultations": await db.consultations.count_documents({}),
        "payments_paid": await db.payments.count_documents({"status": "paid"}),
        "revenue": sum([p["amount"] async for p in db.payments.find({"status": "paid"}, {"amount": 1})]),
    }

@api.get("/admin/diet-requests")
async def admin_diet_requests(_: dict = Depends(require_admin)):
    return await db.diet_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/admin/diet-requests/{rid}/upload")
async def admin_upload_plan(rid: str, req: UploadPlanReq, _: dict = Depends(require_admin)):
    r = await db.diet_requests.update_one(
        {"id": rid},
        {"$set": {"plan_pdf_base64": req.pdf_base64, "status": "completed",
                  "completed_at": now_iso()}}
    )
    if r.matched_count == 0:
        raise HTTPException(404, "Not found")
    return {"ok": True}

@api.post("/admin/diet-requests/{rid}/complete")
async def admin_mark_complete(rid: str, _: dict = Depends(require_admin)):
    await db.diet_requests.update_one({"id": rid}, {"$set": {"status": "completed", "completed_at": now_iso()}})
    return {"ok": True}

@api.get("/admin/consultations")
async def admin_consultations(_: dict = Depends(require_admin)):
    return await db.consultations.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/admin/consultations/{cid}/complete")
async def admin_consult_complete(cid: str, _: dict = Depends(require_admin)):
    await db.consultations.update_one({"id": cid}, {"$set": {"status": "completed"}})
    return {"ok": True}

@api.get("/admin/users")
async def admin_users(_: dict = Depends(require_admin)):
    return await db.users.find({"role": "user"}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(500)

@api.get("/admin/payments")
async def admin_payments(_: dict = Depends(require_admin)):
    return await db.payments.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

# ----- AI Wellness Companion -----
SYSTEM_PRIMER = (
    "You are Pritha — a gentle, calm AI wellness companion in Yogini Kurtadkar's nutrition sanctuary. "
    "You speak warmly, briefly, and never push extreme diets or calorie obsession. "
    "Offer grounded, sustainable, plant-forward suggestions, mindful eating tips, and emotional safety. "
    "Keep replies concise (2-4 short sentences). Use soft, nature-inspired language. "
    "For medical concerns, gently suggest booking a 1:1 consult with Yogini (₹750). "
    "Never diagnose. Never shame. Always non-judgmental."
)

@api.post("/ai/chat")
async def ai_chat(req: ChatReq, user: dict = Depends(get_user)):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "AI not configured")
    sess = f"{user['id']}_{req.session_id}"
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=sess,
        system_message=SYSTEM_PRIMER,
    ).with_model("anthropic", "claude-sonnet-4-6")

    async def gen():
        try:
            async for ev in chat.stream_message(UserMessage(text=req.message)):
                if isinstance(ev, TextDelta):
                    yield ev.content
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            logger.exception("AI error")
            yield (
                "\n[Whisper from the sanctuary: "
                f"I'm resting right now. {str(e)[:80]}]"
            )

    return StreamingResponse(gen(), media_type="text/plain",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

# Profile aggregate
@api.get("/profile/summary")
async def profile_summary(user: dict = Depends(get_user)):
    return {
        "user": user_out(user).model_dump(),
        "diet_requests": await db.diet_requests.count_documents({"user_id": user["id"]}),
        "consultations": await db.consultations.count_documents({"user_id": user["id"]}),
        "journal_entries": await db.journal.count_documents({"user_id": user["id"]}),
    }

app.include_router(api)
app.add_middleware(CORSMiddleware, allow_credentials=True,
                   allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup():
    # Seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": ADMIN_EMAIL, "name": "Yogini Kurtadkar",
            "password_hash": hash_pw(ADMIN_PASSWORD), "role": "admin",
            "is_student": False, "picture": None, "created_at": now_iso(),
        })
        logger.info(f"Seeded admin {ADMIN_EMAIL}")
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.diet_requests.create_index([("user_id", 1), ("created_at", -1)])
    await db.consultations.create_index([("user_id", 1), ("created_at", -1)])
    await db.journal.create_index([("user_id", 1), ("created_at", -1)])
    await db.payments.create_index("order_id", unique=True)

@app.on_event("shutdown")
async def shutdown():
    client.close()
