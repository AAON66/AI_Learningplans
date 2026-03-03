import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .core.config import settings
from .api.v1 import auth, plans, analysis, stages, resources, methods, progress, vip, admin_auth, dashboard

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="智能学习计划系统", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(plans.router, prefix=api_prefix)
app.include_router(analysis.router, prefix=api_prefix)
app.include_router(stages.router, prefix=api_prefix)
app.include_router(resources.router, prefix=api_prefix)
app.include_router(methods.router, prefix=api_prefix)
app.include_router(progress.router, prefix=api_prefix)
app.include_router(vip.router, prefix=api_prefix)
app.include_router(admin_auth.router, prefix=api_prefix)
app.include_router(dashboard.router, prefix=api_prefix)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.get("/health")
def health():
    return {"status": "ok"}
