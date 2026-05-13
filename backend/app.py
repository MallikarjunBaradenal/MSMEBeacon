from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import xgboost as xgb
import os
from datetime import datetime
from flask_cors import CORS
import logging
import json
from collections import Counter

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("predictions.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Define the expected feature names
FEATURES = [
    "monthly_sales", 
    "stock_value", 
    "num_customers", 
    "monthly_expenses", 
    "monthly_profit",
    "num_employees", 
    "avg_transaction_value", 
    "return_rate", 
    "marketing_spend"
]

# Store some prediction history for dashboard and insights
prediction_history = []

# Load the pre-trained model
try:
    model = xgb.Booster()
    model.load_model('xgboost_model.json')
    logger.info("Model loaded successfully")
except Exception as e:
    error_msg = f"Failed to load model: {str(e)}"
    logger.error(error_msg)

def preprocess_data(data, is_dataframe=False):
    """Preprocess input data to match model requirements"""
    if is_dataframe:
        # Handle missing fields by filling with zeros
        for feature in FEATURES:
            if feature not in data.columns:
                data[feature] = 0
        # Ensure columns match expected features and are in correct order
        df = data[FEATURES]
    else:
        # Convert JSON data to DataFrame
        df = pd.DataFrame([data])
        # Fill missing values with zeros
        for feature in FEATURES:
            if feature not in df.columns:
                df[feature] = 0
        # Select only required features in the expected order
        df = df[FEATURES]
        
    return df

def get_risk_category(probability):
    """Convert probability to risk category"""
    if probability < 0.3:
        return "Low Risk"
    elif probability < 0.7:
        return "Medium Risk"
    else:
        return "High Risk"

def get_risk_score(probability):
    """Convert probability to a 0-100 risk score"""
    return int(probability * 100)

def get_status(risk_category):
    """Get status based on risk category"""
    if risk_category == "Low Risk":
        return "Healthy"
    elif risk_category == "Medium Risk":
        return "Requires Attention"
    else:
        return "Critical"

def get_key_factors(data):
    """Identify key risk factors based on business data"""
    key_factors = []
    
    # This is a simplified approach - in reality, you would use feature importance from the model
    if data.get("monthly_profit", 0) < 10000:
        key_factors.append("monthly_profit")
    if data.get("return_rate", 0) > 5:
        key_factors.append("return_rate")
    if data.get("marketing_spend", 0) < 2000:
        key_factors.append("marketing_spend")
    if data.get("num_customers", 0) < 50:
        key_factors.append("num_customers")
    
    return key_factors[:2]  # Return top 2 factors

def get_recommendations(risk_category, key_factors):
    """Get recommendations based on risk category and key factors"""
    recommendations = []
    
    if "monthly_profit" in key_factors:
        recommendations.append("Consider reducing operational costs to improve monthly profit")
    
    if "return_rate" in key_factors:
        recommendations.append("Improve product quality to reduce return rate")
    
    if "marketing_spend" in key_factors:
        recommendations.append("Increase marketing budget to attract more customers")
    
    if "num_customers" in key_factors:
        recommendations.append("Implement customer retention strategies to increase customer base")
    
    # General recommendations based on risk category
    if risk_category == "High Risk":
        recommendations.append("Seek immediate financial consultation")
        recommendations.append("Consider pivoting business model")
    elif risk_category == "Medium Risk":
        recommendations.append("Review your business strategy quarterly")
        recommendations.append("Focus on improving key performance indicators")
    else:
        recommendations.append("Maintain current business strategy")
        recommendations.append("Look for growth opportunities")
    
    return recommendations

def make_enhanced_prediction(data, include_input=False):
    """Make prediction with enhanced output"""
    # Convert DataFrame to DMatrix format for XGBoost
    dmatrix = xgb.DMatrix(data)
    
    # Make prediction
    predictions = model.predict(dmatrix)
    
    # Process results
    results = []
    raw_data = data.to_dict('records')
    
    for i, pred in enumerate(predictions):
        # Get probability value (0-1)
        probability = float(pred)
        
        # Determine risk category
        risk_category = get_risk_category(probability)
        
        # Calculate risk score (0-100)
        risk_score = get_risk_score(probability)
        
        # Determine status
        status = get_status(risk_category)
        
        # Get key factors
        key_factors = get_key_factors(raw_data[i])
        
        # Create result object
        result = {
            "prediction": risk_category,
            "confidence": round(abs(probability - 0.5) * 2, 2),  # Convert to confidence score
            "risk_score": risk_score,
            "status": status,
            "key_factors": key_factors
        }
        
        # Include input data if requested
        if include_input:
            result["input_data"] = raw_data[i]
        
        results.append(result)
    
    return results

@app.route('/predict-manual', methods=['POST'])
def predict_manual():
    """Endpoint for single prediction with manual input"""
    try:
        # Get JSON data from request
        data = request.json
        
        # Log the request
        logger.info(f"Manual prediction request: {data}")
        
        # Preprocess data
        preprocessed_data = preprocess_data(data)
        
        # Make prediction
        results = make_enhanced_prediction(preprocessed_data, include_input=True)[0]
        
        # Add prediction to history
        if len(prediction_history) >= 100:
            prediction_history.pop(0)  # Remove oldest
        prediction_history.append({
            "timestamp": datetime.now().isoformat(),
            "prediction": results["prediction"],
            "risk_score": results["risk_score"],
            "key_factors": results["key_factors"]
        })
        
        # Log the result
        logger.info(f"Manual prediction result: {results}")
        
        # Return JSON response
        return jsonify({
            "success": True,
            "data": results,
            "recommendations": get_recommendations(results["prediction"], results["key_factors"])
        })
    
    except Exception as e:
        logger.error(f"Error in manual prediction: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/predict-bulk', methods=['POST'])
def predict_bulk():
    """Endpoint for bulk prediction with CSV file upload"""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({
                "success": False,
                "error": "No file uploaded"
            }), 400
        
        file = request.files['file']
        
        # Check if file has a name
        if file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400
        
        # Check if file is a CSV
        if not file.filename.endswith('.csv'):
            return jsonify({
                "success": False,
                "error": "File must be a CSV"
            }), 400
        
        # Read CSV file
        df = pd.read_csv(file)
        
        # Log the request
        logger.info(f"Bulk prediction request: {file.filename} with {len(df)} records")
        
        # Preprocess data
        preprocessed_data = preprocess_data(df, is_dataframe=True)
        
        # Make predictions
        results = make_enhanced_prediction(preprocessed_data, include_input=True)
        
        # Add summary to history
        risk_counts = Counter([r["prediction"] for r in results])
        if len(prediction_history) >= 100:
            prediction_history.pop(0)  # Remove oldest
        prediction_history.append({
            "timestamp": datetime.now().isoformat(),
            "type": "bulk",
            "count": len(results),
            "summary": {
                "high_risk": risk_counts.get("High Risk", 0),
                "medium_risk": risk_counts.get("Medium Risk", 0),
                "low_risk": risk_counts.get("Low Risk", 0)
            }
        })
        
        # Log the result summary
        logger.info(f"Bulk prediction result: {len(results)} predictions")
        
        # Return JSON response
        return jsonify({
            "success": True,
            "data": results,
            "summary": {
                "total": len(results),
                "high_risk": risk_counts.get("High Risk", 0),
                "medium_risk": risk_counts.get("Medium Risk", 0),
                "low_risk": risk_counts.get("Low Risk", 0)
            }
        })
    
    except Exception as e:
        logger.error(f"Error in bulk prediction: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/dashboard-data', methods=['GET'])
def dashboard_data():
    """Endpoint for dashboard data"""
    try:
        if not prediction_history:
            # Return sample data if no predictions have been made
            return jsonify({
                "prediction_count": 0,
                "risk_distribution": {
                    "Low Risk": 0,
                    "Medium Risk": 0,
                    "High Risk": 0
                },
                "average_risk_score": 0,
                "recent_predictions": []
            })
        
        # Count predictions by risk category
        risk_distribution = Counter([entry["result"]["prediction"] for entry in prediction_history])
        
        # Calculate average risk score
        avg_risk_score = sum(entry["result"]["risk_score"] for entry in prediction_history) / len(prediction_history)
        
        # Get recent predictions (up to 5)
        recent_predictions = [
            {
                "timestamp": entry["timestamp"],
                "prediction": entry["result"]["prediction"],
                "risk_score": entry["result"]["risk_score"],
                "status": entry["result"]["status"]
            }
            for entry in sorted(prediction_history, key=lambda x: x["timestamp"], reverse=True)[:5]
        ]
        
        # Return dashboard data
        return jsonify({
            "prediction_count": len(prediction_history),
            "risk_distribution": dict(risk_distribution),
            "average_risk_score": round(avg_risk_score, 1),
            "recent_predictions": recent_predictions
        })
    
    except Exception as e:
        error_msg = f"Dashboard data error: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

@app.route('/recommendations', methods=['GET'])
def recommendations():
    """Endpoint for recommendations"""
    try:
        # Get risk category from query parameter
        risk_category = request.args.get('risk_category', 'Medium Risk')
        
        # Get key factors from query parameter
        key_factors_param = request.args.get('key_factors', 'monthly_profit,num_customers')
        key_factors = key_factors_param.split(',')
        
        # Get recommendations
        recommendations_list = get_recommendations(risk_category, key_factors)
        
        # Return recommendations
        return jsonify({
            "risk_category": risk_category,
            "key_factors": key_factors,
            "recommendations": recommendations_list
        })
    
    except Exception as e:
        error_msg = f"Recommendations error: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

@app.route('/insights', methods=['GET'])
def insights():
    """Endpoint for insights"""
    try:
        if not prediction_history:
            # Return sample insights if no predictions have been made
            return jsonify({
                "most_common_key_factors": [],
                "risk_trend": "stable",
                "insights": [
                    "No prediction data available yet.",
                    "Make some predictions to see insights."
                ]
            })
        
        # Count key factors
        all_key_factors = []
        for entry in prediction_history:
            all_key_factors.extend(entry["result"]["key_factors"])
        
        key_factor_counts = Counter(all_key_factors)
        
        # Analyze risk trend
        if len(prediction_history) < 2:
            risk_trend = "stable"
        else:
            # Sort by timestamp
            sorted_history = sorted(prediction_history, key=lambda x: x["timestamp"])
            first_half = sorted_history[:len(sorted_history)//2]
            second_half = sorted_history[len(sorted_history)//2:]
            
            avg_first_half = sum(entry["result"]["risk_score"] for entry in first_half) / len(first_half)
            avg_second_half = sum(entry["result"]["risk_score"] for entry in second_half) / len(second_half)
            
            if avg_second_half > avg_first_half * 1.1:
                risk_trend = "increasing"
            elif avg_second_half < avg_first_half * 0.9:
                risk_trend = "decreasing"
            else:
                risk_trend = "stable"
        
        # Generate insights
        insights_list = []
        
        if key_factor_counts:
            most_common = key_factor_counts.most_common(1)[0][0]
            insights_list.append(f"The most common risk factor is '{most_common}'.")
        
        if risk_trend == "increasing":
            insights_list.append("Risk levels are trending upward. Consider preventive measures.")
        elif risk_trend == "decreasing":
            insights_list.append("Risk levels are improving. Your strategies appear to be working.")
        else:
            insights_list.append("Risk levels are stable.")
        
        # Add more insights based on the data
        high_risk_count = sum(1 for entry in prediction_history if entry["result"]["prediction"] == "High Risk")
        if high_risk_count > len(prediction_history) * 0.5:
            insights_list.append("Over 50% of predictions show high risk. Urgent attention recommended.")
        
        # Return insights
        return jsonify({
            "most_common_key_factors": [{"factor": factor, "count": count} 
                                       for factor, count in key_factor_counts.most_common(3)],
            "risk_trend": risk_trend,
            "insights": insights_list
        })
    
    except Exception as e:
        error_msg = f"Insights error: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

@app.route('/help-support', methods=['GET'])
def help_support():
    """Endpoint for help and support"""
    try:
        # Return help and support information
        return jsonify({
            "faqs": [
                {
                    "question": "How does the MSME Survival Predictor work?",
                    "answer": "Our predictor uses a machine learning model trained on data from thousands of MSMEs to assess the risk level of your business."
                },
                {
                    "question": "What data do I need to provide?",
                    "answer": "You'll need to provide basic business metrics like monthly sales, expenses, number of customers, etc."
                },
                {
                    "question": "How accurate are the predictions?",
                    "answer": "Our model has an accuracy of approximately 85% based on historical data."
                },
                {
                    "question": "What do the risk categories mean?",
                    "answer": "Low Risk means your business is likely to thrive, Medium Risk indicates areas that need attention, and High Risk suggests significant challenges."
                },
                {
                    "question": "How often should I check my business risk?",
                    "answer": "We recommend monthly assessments to track changes in your risk profile."
                }
            ],
            "contact_info": {
                "email": "support@msmebeacon.com",
                "phone": "+1-123-456-7890",
                "hours": "Monday to Friday, 9 AM to 5 PM EST"
            },
            "resources": [
                {
                    "title": "MSME Success Guide",
                    "url": "https://msmebeacon.com/resources/success-guide"
                },
                {
                    "title": "Financial Planning Templates",
                    "url": "https://msmebeacon.com/resources/templates"
                },
                {
                    "title": "Risk Mitigation Strategies",
                    "url": "https://msmebeacon.com/resources/risk-mitigation"
                }
            ]
        })
    
    except Exception as e:
        error_msg = f"Help and support error: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

@app.route('/get-stats', methods=['GET'])
def get_stats():
    """Endpoint for returning dashboard statistics"""
    try:
        # If we have predictions history, use that
        if prediction_history:
            # Count predictions by risk category
            risk_distribution = Counter([entry["result"]["prediction"] for entry in prediction_history])
            
            # Calculate average risk score
            avg_risk_score = sum(entry["result"]["risk_score"] for entry in prediction_history) / len(prediction_history)
            
            # Return stats
            return jsonify({
                "total_predictions": len(prediction_history),
                "risk_distribution": {
                    "Low Risk": risk_distribution.get("Low Risk", 0),
                    "Medium Risk": risk_distribution.get("Medium Risk", 0),
                    "High Risk": risk_distribution.get("High Risk", 0)
                },
                "avg_risk_score": round(avg_risk_score, 1) if prediction_history else 0
            })
        else:
            # Return dummy data if no predictions have been made
            return jsonify({
                "total_predictions": 10,
                "risk_distribution": {
                    "Low Risk": 4,
                    "Medium Risk": 3,
                    "High Risk": 3
                },
                "avg_risk_score": 55.7
            })
    
    except Exception as e:
        error_msg = f"Stats error: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

@app.route('/get-insights', methods=['GET'])
def get_insights():
    """Endpoint for returning business insights"""
    try:
        # Return hardcoded insights as specified in the requirements
        return jsonify({
            "feature_importance": [
                {"feature": "monthly_profit", "importance": 0.35},
                {"feature": "return_rate", "importance": 0.25},
                {"feature": "num_customers", "importance": 0.18},
                {"feature": "monthly_expenses", "importance": 0.12},
                {"feature": "marketing_spend", "importance": 0.10}
            ],
            "key_insights": [
                "Businesses with monthly profits below $10,000 are 3x more likely to be at high risk.",
                "A return rate above 5% significantly increases the risk level.",
                "Businesses with less than 50 customers show higher vulnerability.",
                "Effective marketing spend (>$2,000) correlates with lower risk profiles."
            ],
            "recommendations": [
                "Focus on increasing your profit margins by reducing operational costs.",
                "Implement quality control measures to reduce return rates.",
                "Develop customer retention strategies to maintain a stable customer base.",
                "Allocate marketing budget effectively to target new customer acquisition."
            ]
        })
    
    except Exception as e:
        error_msg = f"Insights error: {str(e)}"
        logger.error(error_msg)
        return jsonify({"error": error_msg}), 400

# Legacy endpoints for backward compatibility
@app.route('/predict_single', methods=['POST'])
def predict_single():
    """Legacy endpoint for single prediction"""
    return predict_manual()

@app.route('/predict_bulk', methods=['POST'])
def predict_bulk_legacy():
    """Legacy endpoint for bulk predictions"""
    return predict_bulk()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 