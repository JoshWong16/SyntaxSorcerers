package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;

public class SignupActivity extends AppCompatActivity {

    private final static String TAG = "SignupActivity";

    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        Spinner spinner = findViewById(R.id.major_spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
                this,
                R.array.majors_array,
                android.R.layout.simple_spinner_item
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);

        findViewById(R.id.submit_button).setOnClickListener(view -> {
            String major = ((Spinner) findViewById(R.id.major_spinner)).getSelectedItem().toString();
            if (major.equals("Select a major")) {
                Toast.makeText(this, "Please select a major", Toast.LENGTH_SHORT).show();
                return;
            }
            handleTokenRetrival();
        });
    }

    /* ChatGPT usage: Partial */
    private void handleTokenRetrival() {
        FirebaseMessaging.getInstance().getToken()
                .addOnCompleteListener(task -> {
                    if (!task.isSuccessful()) {
                        Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                        return;
                    }

                    // Get new FCM registration token
                    String token = task.getResult();
                    Log.d(TAG, "Token: " + token);
                    handleAccountCreation(token);
                });
    }

    /* ChatGPT usage: Partial */
    private void handleAccountCreation(String token) {
        Intent intent = getIntent();
        String email = intent.getStringExtra("email");
        String userId = intent.getStringExtra("userId");
        String name = ((EditText) findViewById(R.id.name_input)).getText().toString();
        String major = ((Spinner) findViewById(R.id.major_spinner)).getSelectedItem().toString();
        Integer yearLevel = Integer.parseInt(((EditText) findViewById(R.id.year_level_input)).getText().toString());
        sendAccountCreationRequest(email, userId, name, major, yearLevel, token);
    }

    /* ChatGPT usage: Partial */
    private void sendAccountCreationRequest(String email, String userId, String name, String major, Integer yearLevel, String notification_token) {
        ServerRequest serverRequest = new ServerRequest(userId);
        JsonObject body = new JsonObject();
        body.addProperty("email", email);
        body.addProperty("name", name);
        body.addProperty("major", major);
        body.addProperty("year_level", yearLevel);
        body.addProperty("notification_token", notification_token);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                if (!response.isJsonNull()) {
                    Toast.makeText(SignupActivity.this, "Account created", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(SignupActivity.this, HomeActivity.class);
                    intent.putExtra("userId", userId);
                    startActivity(intent);
                } else {
                    Toast.makeText(SignupActivity.this, "Account creation failed", Toast.LENGTH_SHORT).show();
                    Intent intent = new Intent(SignupActivity.this, LoginActivity.class);
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
            Log.d(TAG, "body: " + body);
            Log.d(TAG, "making POST request");
            serverRequest.makePostRequest("/users", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}