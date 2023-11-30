package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import java.util.ArrayList;

public class SearchInterestsActivity extends AppCompatActivity {
    
    private final ArrayList<String> keywords = new ArrayList<String>();

    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_interests);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        Intent intent = getIntent();
        String userId = intent.getStringExtra("userId");

        // https://stackoverflow.com/questions/18986713/how-to-add-string-to-listview-dynamically-in-android
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, keywords);
        ListView listView = findViewById(R.id.listView);
        listView.setAdapter(arrayAdapter);

        findViewById(R.id.submitInterestButton).setOnClickListener(v -> {
            String keyword = (((EditText) findViewById(R.id.searchInterestText)).getText()).toString();
            keywords.add(keyword);
            ((EditText) findViewById(R.id.searchInterestText)).setText("");
            arrayAdapter.notifyDataSetChanged();
        });

        findViewById(R.id.clearInterestsButton).setOnClickListener(v -> {
            keywords.clear();
            arrayAdapter.notifyDataSetChanged();
        });

        Button saveInterestsButton = findViewById(R.id.saveInterestsButton);

        saveInterestsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(SearchInterestsActivity.this, DisplayCourseRecommenderActivity.class);
                intent.putExtra("userInterests", keywords);
                intent.putExtra("userId", userId);
                intent.putExtra("default", false);
                startActivity(intent);
            }
        });
    }
}