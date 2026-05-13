# MSME Beacon - Startup Guide

This guide will help you get the MSME Beacon application up and running on your local machine.

## Quick Start

The easiest way to start both servers is to use the provided development script:

```bash
chmod +x run_dev.sh
./run_dev.sh
```

This script will:
- Create a Python virtual environment if it doesn't exist
- Install all required dependencies for both backend and frontend
- Start the Flask backend server on port 5000
- Start the React frontend server on port 3000

## Manual Setup

If you prefer to start the servers manually, follow these steps:

### Backend Setup:

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

### Frontend Setup:

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

## Testing the Application

1. Open your browser and navigate to http://localhost:3000
2. You can access various pages:
   - Dashboard: http://localhost:3000/dashboard
   - Risk Prediction: http://localhost:3000/risk-prediction
   - Recommendations: http://localhost:3000/recommendations
   - Insights: http://localhost:3000/insights
   - Help & Support: http://localhost:3000/help-support

3. To test a prediction with sample data:
   - Go to http://localhost:3000/risk-prediction
   - Enter the following values in the form:
     - Monthly Sales: 55000
     - Stock Value: 35000
     - Number of Customers: 150
     - Monthly Expenses: 35000
     - Monthly Profit: 20000
     - Number of Employees: 6
     - Average Transaction Value: 366.67
     - Return Rate: 2.8
     - Marketing Spend: 5000
   - Click "Make Prediction" to see the results

4. To test bulk upload:
   - Go to http://localhost:3000/risk-prediction
   - Click the "Bulk Upload" tab
   - Upload the provided `sample_msme_data.csv` file from the backend directory
   - Click "Upload and Predict" to see bulk prediction results

## API Endpoints for Testing

You can also test the API endpoints directly:

1. Single Prediction:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"monthly_sales": 55000, "stock_value": 35000, "num_customers": 150, "monthly_expenses": 35000, "monthly_profit": 20000, "num_employees": 6, "avg_transaction_value": 366.67, "return_rate": 2.8, "marketing_spend": 5000}' http://localhost:5000/predict-manual
```

2. Dashboard Statistics:
```bash
curl http://localhost:5000/get-stats
```

3. Insights:
```bash
curl http://localhost:5000/get-insights
```

## Troubleshooting

If you encounter any issues, here are some common solutions:

### CORS Issues

If you're seeing CORS errors in the browser console, make sure:
- The backend is running on port 5000
- The frontend is running on port 3000
- CORS is properly configured in the backend (which it should be in our app.py)

### Model Loading Issues

If the model fails to load:
- Check that `xgboost_model.json` exists in the backend directory
- If it doesn't exist, the application will use default responses

### Database Connection Issues

This application doesn't use a persistent database. All data is stored in memory and will be reset when the server restarts.

Happy testing! 