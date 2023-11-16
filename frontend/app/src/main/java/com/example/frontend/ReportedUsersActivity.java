package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.Set;

public class ReportedUsersActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reported_users);

        getAllReportedUsers();
    }

    /* ChatGPT usage: None */
    public void getAllReportedUsers() {
        /* request to get all reported users */
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("Reported Users", response.toString());
                ((LinearLayout) findViewById(R.id.reportedUsersLayoutAll)).removeAllViews();

                Object[] reportedUserKeys = response.getAsJsonObject().keySet().toArray();

                for (Object key: reportedUserKeys) {
                    JsonObject reportedUser = response.getAsJsonObject().get(key.toString()).getAsJsonObject();
                    makeReportedUser(reportedUser);
                }
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/reports/all-users", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }

    }


    /* ChatGPT usage: Partial */
    public void makeReportedUser(JsonObject reportedUser) {

        View reportedUserView = getLayoutInflater().inflate(R.layout.reported_users_card, null);

        /* use reportedUser to fill the fields of the card */
        String userName = reportedUser.get("userInfo").getAsJsonObject().get("name").getAsString();
        String reportCount = reportedUser.get("reportCount").getAsString();
        String userId = reportedUser.get("userInfo").getAsJsonObject().get("userId").getAsString();
        ((TextView) reportedUserView.findViewById(R.id.report_user_name)).setText(userName);
        ((TextView) reportedUserView.findViewById(R.id.course_name)).setText("Number of times reported: " + reportCount);

        reportedUserView.findViewById(R.id.ban_button).setOnClickListener(view -> {
                /* ban the user */
            banUser(userId);
            });

        reportedUserView.findViewById(R.id.show_reported_posts_comments_button).setOnClickListener(view -> {
                Intent intent = new Intent(this, ReportedPostCommentsActivity.class);
                intent.putExtra("userId", userId);
                intent.putExtra("name", userName);
                startActivity(intent);

            });


        ((LinearLayout) findViewById(R.id.reportedUsersLayoutAll)).addView(reportedUserView, 0);
    }

    public void banUser(String userId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userIdReporter = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userIdReporter);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");


                Toast.makeText(ReportedUsersActivity.this, "User has been banned.", Toast.LENGTH_SHORT).show();

            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        JsonObject body = new JsonObject();
        body.addProperty("userId", userId);

        try {
            serverRequest.makePostRequest("/banned/", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }


}