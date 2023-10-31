package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ListView;
import android.widget.Toast;

import com.example.frontend.adapters.CheckBoxAdapter;
import com.example.frontend.apiWrappers.ServerRequest;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;


import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class CourseRecommenderActivity extends AppCompatActivity {
    private final static String TAG = "CourseRecommenderActivity";

    private final List<CheckBox> checkboxes = new ArrayList<CheckBox>();

    /* ChatGPT usage: No */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course_recommender);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        Intent intent = getIntent();
        String userId = intent.getStringExtra("userId");

        ListView listView = findViewById(R.id.listView);

        showInterestsChecklist(listView, userId);

        Button saveCheckListButton = findViewById(R.id.saveCheckListButton);

        saveCheckListButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                ArrayList<String> userInterests = saveUserInterests();
                Intent intent = new Intent(CourseRecommenderActivity.this, DisplayCourseRecommenderActivity.class);
                intent.putExtra("userInterests", userInterests);
                intent.putExtra("userId", userId);
                startActivity(intent);
            }
        });
    }

    /* ChatGPT usage: Partial */
    void showInterestsChecklist(ListView listView, String userId) {
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                if (!response.isJsonNull()) {
                    Toast.makeText(CourseRecommenderActivity.this, "Interests List Received", Toast.LENGTH_SHORT).show();
                    JsonArray interests = response.getAsJsonArray();

                    /* https://stackoverflow.com/questions/15871309/convert-jsonarray-to-string-array */
                    List<String> items = new ArrayList<String>();
                    for(int i = 0; i < interests.size(); i++){
                        items.add(interests.get(i).getAsString());
                    }

                    /* https://stackoverflow.com/questions/7618553/how-to-add-checkboxes-dynamically-in-android */

                    for (int i = 0; i < items.size(); i++) {
                        CheckBox checkBox = new CheckBox(getApplicationContext());
                        checkBox.setText(items.get(i));
                        checkboxes.add(checkBox);
                    }


                    /* Chat-GPT generated code to dynamically add checkboxes to the list view */

                    /* Create an CheckBoxAdapter to bind the array to the ListView */
                    CheckBoxAdapter adapter = new CheckBoxAdapter(CourseRecommenderActivity.this, checkboxes);

                    // Set the adapter to the ListView
                    listView.setAdapter(adapter);

                } else {
                    Toast.makeText(CourseRecommenderActivity.this, "Unable to Retrieve Interests List", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            Log.d(TAG, "making GET request");
            serverRequest.makeGetRequest("/users/courseKeywords", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }

    }

    /* ChatGPT usage: No */
    ArrayList<String> saveUserInterests() {

        ArrayList<String> userInterests = new ArrayList<String>();

        for (int i = 0; i < checkboxes.size(); i++) {
            CheckBox checkbox = checkboxes.get(i);
            if (checkbox.isChecked()) {
                userInterests.add((String) checkbox.getText());
            }
        }

        return userInterests;

    }

}