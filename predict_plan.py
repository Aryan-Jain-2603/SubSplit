import sys
import joblib
import json

# Read arguments
price = int(sys.argv[1])
slots = int(sys.argv[2])
type_input = sys.argv[3]
cat_input = sys.argv[4]

# Load model and encoders
model = joblib.load('plan_classifier.pkl')
le_type = joblib.load('type_encoder.pkl')
le_cat = joblib.load('cat_encoder.pkl')

# Handle unknown type or category gracefully
if type_input not in le_type.classes_ or cat_input not in le_cat.classes_:
    print(json.dumps({'prediction': 'unknown'}))
    sys.exit()


# Encode inputs
type_encoded = le_type.transform([type_input])[0]
cat_encoded = le_cat.transform([cat_input])[0]

# Predict
X = [[price, slots, type_encoded, cat_encoded]]
pred = model.predict(X)[0]

# Output prediction
print(json.dumps({'prediction': 'good' if pred == 1 else 'bad'}))
