from flask import Flask, request, jsonify, render_template, url_for
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__, static_url_path='/static')

# Load environment variables and configure Gemini
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_travel_itinerary(destination, start_date, end_date, interests):
    # Initialize Gemini Pro model
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Create a detailed travel itinerary for a trip to {destination} from {start_date} to {end_date}.
    The traveler is interested in {interests}. 
    Please include:
    - Daily activities
    - Places to visit
    - Restaurant recommendations
    - Local attractions
    Format the response with clear day-by-day breakdown.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating itinerary: {str(e)}")
        return "Error generating itinerary. Please try again."

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate-itinerary', methods=['POST'])
def generate_itinerary():
    try:
        data = request.json
        itinerary = get_travel_itinerary(
            data['destination'],
            data['startDate'],
            data['endDate'],
            data['interests']
        )
        return jsonify({'itinerary': itinerary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
