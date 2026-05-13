import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

# Create sample data
X, y = make_classification(n_samples=1000, n_features=5, n_informative=3,
                           n_redundant=1, n_classes=2, random_state=42)

# Convert to feature names that match our application
X_df = pd.DataFrame(X, columns=['feature1', 'feature2', 'feature3', 'feature4', 'feature5'])

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X_df, y, test_size=0.2, random_state=42)

# Create DMatrix
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Set parameters
params = {
    'objective': 'binary:logistic',
    'max_depth': 4,
    'eta': 0.1,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'eval_metric': 'logloss'
}

# Train model
num_rounds = 100
model = xgb.train(params, dtrain, num_rounds)

# Save model
model.save_model('xgboost_model.json')

print("Sample model created and saved as 'xgboost_model.json'")

# Create sample CSV for bulk testing
num_samples = 10
X_sample, _ = make_classification(n_samples=num_samples, n_features=5, 
                                  n_informative=3, n_redundant=1, 
                                  n_classes=2, random_state=24)

sample_df = pd.DataFrame(X_sample, columns=['feature1', 'feature2', 'feature3', 'feature4', 'feature5'])
sample_df.to_csv('sample_data.csv', index=False)

print("Sample CSV created with 10 records as 'sample_data.csv'")

# Test a prediction
test_data = xgb.DMatrix(X_test[:1])
prediction = model.predict(test_data)
print(f"Sample prediction (probability): {prediction[0]}")
print(f"Class prediction: {'Survives' if prediction[0] > 0.5 else 'Fails'}")
print(f"Confidence: {max(prediction[0], 1-prediction[0]):.2f}") 