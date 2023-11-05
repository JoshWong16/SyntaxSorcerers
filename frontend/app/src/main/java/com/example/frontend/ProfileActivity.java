package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.SpannableStringBuilder;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.squareup.picasso.Picasso;

import java.io.UnsupportedEncodingException;
import java.util.Objects;

public class ProfileActivity extends AppCompatActivity {

    private String name;
    private String major;
    private String yearLevel;

    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);
        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_profile);

        getUserInfo();

        findViewById(R.id.edit_button).setOnClickListener(view -> {
            Intent intent = new Intent(this, EditProfileActivity.class);
            intent.putExtra("name", name);
            intent.putExtra("major", major);
            intent.putExtra("yearLevel", yearLevel);
            startActivity(intent);
        });
    }

    /* ChatGPT usage: Partial */
    private void getUserInfo() {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String accountDisplayImage = sharedPreferences.getString("accountDisplayImage", null);
        String userId = sharedPreferences.getString("userId", null);
        String[] accountName = sharedPreferences.getString("accountName", null).split(" ");
        if (Objects.equals(accountDisplayImage, "")) {
            Picasso.get().load("https://eu.ui-avatars.com/api/?name=" + accountName[0] + "+" + accountName[accountName.length - 1] + "&size=250").into((ImageView) findViewById(R.id.account_display_image));
        } else {
            Picasso.get().load(accountDisplayImage).into((ImageView) findViewById(R.id.account_display_image));
        }

        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                name = response.getAsJsonObject().get("name").getAsString();
                major = response.getAsJsonObject().get("major").getAsString();
                yearLevel = response.getAsJsonObject().get("year_level").getAsString();
                ((TextView) findViewById(R.id.account_name)).setText("Name: " + name);
                ((TextView) findViewById(R.id.major)).setText("Major: " + major);
                ((TextView) findViewById(R.id.year_level)).setText("Year Level: " + yearLevel);
                getUserCourses(userId);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/users", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void getUserCourses(String userId) {
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                SpannableStringBuilder builder = new SpannableStringBuilder();
                for (JsonElement course : response.getAsJsonArray()) {
                    builder.append("• ");
                    builder.append(course.getAsString());
                    builder.append("\n");
                }
                TextView favouriteCourses = findViewById(R.id.favourite_courses);
                favouriteCourses.setText(builder);
                favouriteCourses.setTextSize(20);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/users/favourite", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }
}