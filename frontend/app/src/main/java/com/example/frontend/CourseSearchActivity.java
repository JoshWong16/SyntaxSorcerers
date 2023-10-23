package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.example.frontend.apiWrappers.UBCGradesRequest;
import com.google.gson.JsonArray;

import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

public class CourseSearchActivity extends AppCompatActivity {

    private Spinner spinner;
    private ArrayAdapter<String> adapter;
    private JsonArray yearSessionsArray;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course_search);
        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        spinner = findViewById(R.id.yearSession);
        adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);

        UBCGradesRequest ubcGradesRequest = new UBCGradesRequest();
        UBCGradesRequest.ApiRequestListener apiRequestListener = new UBCGradesRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonArray response) {
                yearSessionsArray = response;
                updateSpinnerWithYearSessions();
                setSpinnerOnItemSelectedListener();
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(UBCGradesRequest.RequestTag, "Failure");
                Log.d(UBCGradesRequest.RequestTag, error);
            }
        };

        try {
            ubcGradesRequest.makeGetRequest("api/v3/yearsessions/UBCV", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private void setSpinnerOnItemSelectedListener() {
        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                String selectedItem = adapter.getItem(position);
                // Handle the selected item here
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
                // Do nothing here
            }
        });
    }
    private void updateSpinnerWithYearSessions() {
        adapter.clear();

        for (int i = 0; i < yearSessionsArray.size(); i++) {
            adapter.add(yearSessionsArray.get(i).getAsString());
        }

        adapter.notifyDataSetChanged();
    }
}