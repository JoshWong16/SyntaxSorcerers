package com.example.frontend;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class ForumActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum);

        BottomNavigationView bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setSelectedItemId(R.id.action_forums);
        bottomNavigationView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                int id = item.getItemId();
                switch (id) {
                    case R.id.action_home:
                        startActivity(new Intent(ForumActivity.this, HomeActivity.class));
                        return true;
                    case R.id.action_forums:
                        startActivity(new Intent(ForumActivity.this, ForumActivity.class));
                        return true;
                    case R.id.action_profile:
                        startActivity(new Intent(ForumActivity.this, ProfileActivity.class));
                        return true;
                }
                return false;
            }
        });
    }
}