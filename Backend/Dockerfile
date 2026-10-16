# 1. Use the matching Python version
FROM python:3.12-slim

# 2. Set the working directory inside the container
WORKDIR /Backend

# 3. Copy requirements first (improves Docker build caching)
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy everything from Backend (including your local raw folder) into the container
COPY . .

ENV PYTHONPATH=/Backend

# Because you copied everything, your code is now at: /raw/raw/main.py
CMD ["uvicorn", "raw.main:app", "--host", "0.0.0.0", "--port", "8000"]
