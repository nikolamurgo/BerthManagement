# Berth Management

tua ima deskripshn

## /set up

### Requirements:
1. Latest Node and NPM versions
2. Latest Python version with `pip` installed
3. Install the required python packages:

Required python packages can be installed with the command:
```
pip install uvicorn FastAPI pydantic joblib datetime pickle pandas json Request
```

### Start the backend:

Navigate to `server` and run the following commands:
```
python app.py
uvicorn app:app --reload
```

The backend is running on `localhost:8000`. To see the API documentation, navigate to `localhost:8000/docs`

### Start the frontend:

Navigate to `Client` and run the following commands:
```
npm install
npm run
```

Frontend is running on `localhost:3000`.

