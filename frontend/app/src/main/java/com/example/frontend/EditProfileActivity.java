package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.example.frontend.apiWrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;

public class EditProfileActivity extends AppCompatActivity {

    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);

        String name = getIntent().getStringExtra("name");
        String major = getIntent().getStringExtra("major");
        String yearLevel = getIntent().getStringExtra("yearLevel");

        TextView nameInput = findViewById(R.id.name_input);
        nameInput.setText(name);
        TextView yearLevelInput = findViewById(R.id.year_level_input);
        yearLevelInput.setText(yearLevel);
        Spinner majorSpinner = findViewById(R.id.major_spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                this,
                R.array.majors_array,
                android.R.layout.simple_spinner_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        majorSpinner.setAdapter(adapter);
        majorSpinner.setSelection(adapter.getPosition(major));

        findViewById(R.id.save_button).setOnClickListener(view -> {
            String major_val = majorSpinner.getSelectedItem().toString();
            String yearLevel_val = yearLevelInput.getText().toString();
            String name_val = nameInput.getText().toString();

            sendUpdateUserRequest(name_val, major_val, yearLevel_val);
        });
    }

    /* ChatGPT usage: Partial */
    private void sendUpdateUserRequest(String name, String major, String yearLevel) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        JsonObject body = new JsonObject();
        body.addProperty("name", name);
        body.addProperty("major", major);
        body.addProperty("year_level", yearLevel);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Toast.makeText(EditProfileActivity.this, "Profile updated", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(EditProfileActivity.this, ProfileActivity.class);
                startActivity(intent);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makePutRequest("/users", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}