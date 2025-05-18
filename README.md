# Berth Management
An efficient and effective management system that predicts the right place and time for vessels at docking ports to berth, enabling minimal wait time. Developed using ML model in Python, using real data from online resources. 

This project consists of a backend and frontend setup:
- Backend: Built using `Python` and `FastAPI`, it provides API endpoints for berth scheduling and management. It runs on `localhost:8000`, and API documentation is available at `localhost:8000/docs`.
- Frontend: A client-side application developed with `Node.js` and `npm` that allows users to interact with berth scheduling functionalities. It runs on `localhost:3000`.

The model is available inside the `model` directory. ★Please do not remove this model!★

## Requirements:
1. Latest Node and NPM versions
2. Latest Python version with `pip` installed
3. Install the required python packages:

## Set up

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

