from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from routes import predict
import uvicorn

app = FastAPI(
    title="AI Disaster Verification Service",
    description="FastAPI service for verifying and predicting disaster severity using AI.",
    version="1.0.0"
)

# Include routes
app.include_router(predict.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "AI Disaster Service is running. Use /docs for API documentation."}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5001, reload=True)
