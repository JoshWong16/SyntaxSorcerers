package com.example.frontend;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.frontend.adapters.CheckBoxAdapter;
import com.example.frontend.apiWrappers.ServerRequest;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

public class HomeActivity extends AppCompatActivity {

    private final static String TAG = "HomeActivity";

    /**
     * ChatGPT Usage: Partial
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Button searchCourseButton = findViewById(R.id.SearchCoursesButton);
        Button compareCoursesButton = findViewById(R.id.CompareCoursesButton);
        Button courseRecommenderButton = findViewById(R.id.RecommenderButton);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        Intent intent = getIntent();
        String userId = intent.getStringExtra("userId");

        courseRecommenderButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Send a call to the backend and check if the user has any interests
                // If yes, send to DisplayCourseRecommender page
                // If no, send to the startActivity page
                Intent intent = new Intent(HomeActivity.this, CourseRecommenderActivity.class);
                intent.putExtra("userId", userId);
                startActivity(intent);
            }
        });
    }

    /**
     * ChatGPT Usage: No
     */
    public void searchCourses(View view) {
        Intent intent = new Intent(this, CourseSearchActivity.class);
        startActivity(intent);
    }

    /**
     * ChatGPT Usage: No
     */
    public void compareCourse(View view) {
        Intent intent = new Intent(this, CompareCoursesActivity.class);
        startActivity(intent);
    }

    void checkUserInterests(String userId) {
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                if (!response.isJsonNull()) {
                    ArrayList<String> interests = new ArrayList<>();

                    for (JsonElement interest : response.getAsJsonArray()) {
                        interests.add(interest.getAsString());
                    }

                    Intent intent = new Intent(HomeActivity.this, DisplayCourseRecommenderActivity.class);
                    intent.putExtra("userId", userId);
                    intent.putExtra("interests", interests);
                    startActivity(intent);
                } else {
                    Intent intent = new Intent(HomeActivity.this, CourseRecommenderActivity.class);
                    intent.putExtra("userId", userId);
                    startActivity(intent);
                }
            }
            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            Log.d(TAG, "making GET request to /user/interests");
            serverRequest.makeGetRequest("/users/interests", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}