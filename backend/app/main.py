from fastapi import FastAPI

from app.routes.users import router as user_router

app = FastAPI(
    title="Virei Peixe API",
    version="1.0.0",
)

app.include_router(user_router)


@app.get("/")
def root():
    return {"message": "Virei Peixe API"}


@app.get("/health")
def health():
    return {"status": "ok"}