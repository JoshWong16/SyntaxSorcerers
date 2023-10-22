import requests

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
            print(courses)
        else:
            print(f"API call failed with status code {subject_res.status_code}")

else:
    print(f"API call failed with status code {response.status_code}")
