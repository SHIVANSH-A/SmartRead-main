import pandas as pd
import numpy as np
import re
import sys
import json
import joblib

# Load the trained model
try:
    model = joblib.load('trained_gbm_model.pkl')  # Ensure the model path is correct
except Exception as e:
    print(json.dumps({"error": f"Error loading model: {str(e)}"}))
    sys.exit(1)

# Load the frequency data
frequency_data = pd.read_csv('WordFrequency.csv')

# Load the data to compute features
data = pd.read_csv('WordDifficulty.csv').dropna()
data['label'] = (data['I_Mean_Accuracy'] < 0.64).astype(int)
features = ['Length', 'Log_Freq_HAL', 'I_Mean_RT', 'I_Zscore', 'I_SD', 'Obs']

# List of easy words (days and months)
easy_words = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 
    'september', 'october', 'november', 'december'
]

# Calculate frequency scaling factor
difficulty_max_freq = np.exp(data['Log_Freq_HAL'].max())  # Max frequency in difficulty dataset
frequency_max_freq = frequency_data['count'].max()  # Max frequency in frequency dataset
scaling_factor = difficulty_max_freq / frequency_max_freq

def compute_features(new_word, frequency_df, mean_rt, mean_sd, scaling_factor):
    length = len(new_word)
    
    # Try to get frequency from frequency_df, default to 1 if not found
    freq_hal = frequency_df.set_index('word')['count'].get(new_word, 1)
    
    # Handle cases where frequency is missing or zero
    scaled_freq_hal = freq_hal * scaling_factor if freq_hal > 0 else 1
    log_freq_hal = np.log(scaled_freq_hal)
   
    zscore = 0  # Default zscore for unseen words
    obs = 1  # Default observation status for new words
    
    return [length, log_freq_hal, mean_rt, zscore, mean_sd, obs]

def predict_word_difficulty(new_word):
    # Handle single-letter words and easy words directly as "easy"
    if len(new_word) == 1 or new_word.lower() in easy_words:
        return "easy"
    
    if new_word in data['Word'].values:
        # Word is in the difficulty dataset
        word_data = data[data['Word'] == new_word]
        word_features = word_data[features].values[0]
    else:
        # Word is not in the difficulty dataset, compute features
        mean_rt = data['I_Mean_RT'].mean()
        mean_sd = data['I_SD'].mean()
        
        # Compute features for the word
        word_features = compute_features(new_word, frequency_data, mean_rt, mean_sd, scaling_factor)
    
    # Predict difficulty
    predicted_label = model.predict([word_features])  # Use 'model' here instead of 'gbm'
    return "hard" if predicted_label[0] == 1 else "easy"

def predict_paragraph_difficulty(paragraph):
    words = re.findall(r'\b\w+\b', paragraph.lower())
    word_difficulties = {}
    
    for word in words:
        difficulty = predict_word_difficulty(word)
        word_difficulties[word] = difficulty

    return word_difficulties

# Get the paragraph from stdin (from Node.js)
paragraph = sys.stdin.read().strip()

# Predict word difficulties and print as JSON
try:
    word_difficulties = predict_paragraph_difficulty(paragraph)
    print(json.dumps(word_difficulties))  # Output as JSON
except Exception as e:
    print(json.dumps({"error": str(e)}))  # Output any errors as JSON

# Flush the output
sys.stdout.flush()