import requests
import openai
from tqdm import tqdm
# import nltk

# Set your API key
openai.api_key = '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'

# Define the URL of the API you want to call
api_url = 'https://ubcgrades.com/api/v3/subjects/UBCV'
response = requests.get(api_url)

if response.status_code == 200:
    data = response.json()
    subjects = []

    for d in data:
        subjects.append(d['subject'])

    
    res_texts = []
    
    for subject in tqdm(subjects, desc="Getting courses for each subject"):
        print(f'Getting courses for {subject}')
        subject_url = f'https://ubcgrades.com/api/v3/courses/UBCV/{subject}'
        subject_res = requests.get(subject_url)

        if subject_res.status_code == 200:
            data = subject_res.json()
            
            courses = []
            for obj in data:
                courses.append((subject, obj["course"], obj["course_title"]))

            # Construct the course list as a formatted string
            course_list_str = "\n".join([f"{subject}{course} - {course_title}" for subject, course, course_title in courses])

            # Define a conversation with user and assistant messages
            conversation = [
                {"role": "user", "content": f"Categorize these courses into several specific groups based on their titles, content, and potential themes: {course_list_str}"}
            ]

            # Make an API request to the chat-based endpoint
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=conversation
            )

            # Get the response text from the assistant's message
            response_text = response['choices'][0]['message']['content']
            res_texts.append(response_text)
            with open('courses.txt', 'a') as f:
                f.write("\n".join(response_text.split("\n")[1:]))
            
        else:
            print(f"API call failed with status code {subject_res.status_code}")

else:
    print(f"API call failed with status code {response.status_code}")