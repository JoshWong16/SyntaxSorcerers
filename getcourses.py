import requests
import openai

# Set your API key
openai.api_key = 'YOUR_API_KEY'

# Define the URL of the API you want to call
api_url = 'https://ubcgrades.com/api/v3/subjects/UBCV'
response = requests.get(api_url)

if response.status_code == 200:
    data = response.json()
    subjects = []

    for d in data:
        subjects.append(d['subject'])
    
    for subject in subjects:
        subject_url = f'https://ubcgrades.com/api/v3/courses/UBCV/{subject}'
        subject_res = requests.get(subject_url)

        if subject_res.status_code == 200:
            data = subject_res.json()
            courses = []
            for obj in data:
                courses.append(obj['course_title'])
            # with open("courses.txt", "a") as txt_file:
            #     for line in courses:
            #         txt_file.write("".join(line) + "\n")
        else:
            print(f"API call failed with status code {subject_res.status_code}")

    print(len(courses))

else:
    print(f"API call failed with status code {response.status_code}")

# Define the API request
response = openai.Completion.create(
    engine="gpt-3.5-turbo",
    prompt="Generate a list of courses: \n1. Course A\n2. Course B\n3. Course C\nGroup these courses into categories:",
    max_tokens=50  # Adjust the number of tokens based on the desired output length
)
