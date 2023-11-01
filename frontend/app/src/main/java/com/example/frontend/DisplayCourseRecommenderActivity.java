package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.example.frontend.apiWrappers.ServerRequest;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

public class DisplayCourseRecommenderActivity extends AppCompatActivity {

    private final static String TAG = "DisplayCourseRecommenderActivity";

    /* ChatGPT usage: No */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_display_course_recommender);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        ListView listView = findViewById(R.id.listViewDisplay);

        Intent intent = getIntent();
        ArrayList<String> userInterests = intent.getStringArrayListExtra("userInterests");
        String userId = intent.getStringExtra("userId");

        displayRecommendedCourses(userInterests, userId, listView);


    }

    /* ChatGPT usage: Partial */
    void displayRecommendedCourses(ArrayList<String> userInterests, String userId, ListView listView) {
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                if (!response.isJsonNull()) {
                    Toast.makeText(DisplayCourseRecommenderActivity.this, "Recommended Courses Displayed", Toast.LENGTH_SHORT).show();
                    JsonObject recommendedCourses = response.getAsJsonObject();
                    ArrayList<String> items = new ArrayList<String>();

                    /* ChatGPT generated to parse JSON Object */
                    for (int i = 0; i < userInterests.size(); i++) {
                        JsonArray courseList = recommendedCourses.getAsJsonArray(userInterests.get(i));
                        for (int j = 0; j < courseList.size(); j++) {
                            items.add(courseList.get(j).getAsString());
                        }

                    }

                    ArrayAdapter<String> adapter = new ArrayAdapter<>(DisplayCourseRecommenderActivity.this, android.R.layout.simple_list_item_1, items);


                    // Set the adapter to the ListView
                    listView.setAdapter(adapter);

                } else {
                    Toast.makeText(DisplayCourseRecommenderActivity.this, "Unable to Retrieve Course Recommended List", Toast.LENGTH_SHORT).show();
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

            String endpoint = "/users/recommendedCourses?userKeywords=";
            for (int i = 0; i < userInterests.size(); i++) {
                endpoint += userInterests.get(i);
                if (i != userInterests.size() - 1) {
                    endpoint += ",";
                }
            }

            serverRequest.makeGetRequest(endpoint, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}