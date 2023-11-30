package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class CourseRecommenderActivity extends AppCompatActivity {
    /**
     * ChatGPT Usage: Partial
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course_recommender);

        Button selectInterestButton = findViewById(R.id.SelectInterestsButton);
        Button searchInterestButton = findViewById(R.id.SearchInterestsButton);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        Intent intent = getIntent();
        String userId = intent.getStringExtra("userId");

        selectInterestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(CourseRecommenderActivity.this, SelectInterestsActivity.class);
                intent.putExtra("userId", userId);
                startActivity(intent);
            }
        });

        searchInterestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(CourseRecommenderActivity.this, SearchInterestsActivity.class);
                intent.putExtra("userId", userId);
                startActivity(intent);
            }
        });
    }
}