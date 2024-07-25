from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import torch
import json
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize
import numpy as np
import random

app = Flask(__name__)
CORS(app)

# Load model and data
with open('intents.json', 'r') as f:
    intents = json.load(f)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size)
model.load_state_dict(model_state)
model.eval()

@app.route('/predict', methods=['POST'])
def predict():
    message = request.json['message']
    sentence = tokenize(message)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X)

    output = model(X)
    _, predicted = torch.max(output, dim=1)
    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]

    if prob.item() > 0.75:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return jsonify({"message": random.choice(intent['responses'])})

    return jsonify({"message": "I do not understand..."})

if __name__ == "__main__":
    app.run(debug=True)
