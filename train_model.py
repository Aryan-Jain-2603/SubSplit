import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load data
df = pd.read_csv('data.csv')

# Encode categorical features
le_type = LabelEncoder()
le_cat = LabelEncoder()
df['type'] = le_type.fit_transform(df['type'])
df['categories'] = le_cat.fit_transform(df['categories'])
df['label'] = df['good_plan']

# Train/test split
X = df[['price', 'slots', 'type', 'categories']]
y = df['label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save model and encoders
joblib.dump(model, 'plan_classifier.pkl')
joblib.dump(le_type, 'type_encoder.pkl')
joblib.dump(le_cat, 'cat_encoder.pkl')
