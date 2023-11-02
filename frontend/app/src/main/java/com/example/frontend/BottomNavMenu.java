package com.example.frontend;

import android.content.Context;
import android.content.Intent;
import android.view.MenuItem;

import androidx.annotation.NonNull;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class BottomNavMenu {

    /**
     * ChatGPT Usage: Partial
     */
    public static void createBottomNavMenu(Context context, BottomNavigationView menuView, int currentItemId) {
        menuView.setSelectedItemId(currentItemId);
        menuView.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                int id = item.getItemId();
                switch (id) {
                    case R.id.action_home:
                        context.startActivity(new Intent(context, HomeActivity.class));
                        return true;
                    case R.id.action_forums:
                        context.startActivity(new Intent(context, ForumActivity.class));
                        return true;
                    case R.id.action_profile:
                        context.startActivity(new Intent(context, ProfileActivity.class));
                        return true;
                    default:

                }
                return false;
            }
        });
    }
}
