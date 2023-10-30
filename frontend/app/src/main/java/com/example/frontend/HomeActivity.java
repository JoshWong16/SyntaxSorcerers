package com.example.frontend;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class HomeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Button searchCourseButton = findViewById(R.id.SearchCoursesButton);
        Button compareCoursesButton = findViewById(R.id.CompareCoursesButton);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);
    }


    public void searchCourses(View view) {
        Intent intent = new Intent(this, CourseSearchActivity.class);
        startActivity(intent);
    }

    public void compareCourse(View view) {
        Intent intent = new Intent(this, CompareCoursesActivity.class);
        startActivity(intent);
    }
}