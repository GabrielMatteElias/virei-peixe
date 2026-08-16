from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.users import router as user_router
from app.routes.imports import router as import_router

app = FastAPI(docs_url="/docs", redoc_url="/redoc")

app = FastAPI(
    title="Virei Peixe API",
    version="1.0.0",
)

app.include_router(user_router)
app.include_router(import_router)


origins = [
    # "http://localhost:5173",
    #"http://localhost:3000",
    "https://virei-peixe-bice.vercel.app",
    "https://virei-peixe-bice.vercel.app/",
    "https://www.vireipeixe.com.br/",
    "https://vireipeixe.com.br/",
    "https://www.vireipeixe.com.br",
    "https://vireipeixe.com.br"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Virei Peixe API"}


@app.get("/health")
def health():
    return {"status": "ok"}