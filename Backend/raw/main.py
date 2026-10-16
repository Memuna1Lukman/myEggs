from fastapi import FastAPI
from . import models
from .database import engine
from .routes import auth, orders, products, users
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Keep local development usable without a separate migration step.  Use a
# migration tool before changing an existing production schema.
# models.Base.metadata.create_all(bind=engine)


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
