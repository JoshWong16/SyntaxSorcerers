import requests

# Define the URL of the API you want to call
api_url = 'https://ubcgrades.com/api/v3/courses/UBCV/MATH'

# Make a GET request to the API
response = requests.get(api_url)

# Check the response status code
if response.status_code == 200:
    # API call was successful
    data = response.json()
    courses = []
    for obj in data:
        courses.append(obj['course_title'])
    print(courses)
else:
    # API call was not successful
    print(f"API call failed with status code {response.status_code}")
