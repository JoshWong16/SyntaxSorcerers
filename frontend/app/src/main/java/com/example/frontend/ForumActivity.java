package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TabHost;
import android.widget.TextView;

import com.example.frontend.apiWrappers.ServerRequest;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

public class ForumActivity extends AppCompatActivity {

    ArrayList<View> joinedForumsViews;
    ArrayList<View> allForumsViews;

    JsonArray joinedForums = new JsonArray();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum);

        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_forums);

        TabHost tabHost = findViewById(R.id.forumTabHost);
        tabHost.setup();

        TabHost.TabSpec tabSpec1 = tabHost.newTabSpec("Tab1");
        tabSpec1.setIndicator("Joined");
        tabSpec1.setContent(R.id.joinedForums);

        TabHost.TabSpec tabSpec2 = tabHost.newTabSpec("Tab2");
        tabSpec2.setIndicator("All");
        tabSpec2.setContent(R.id.allComments);
        tabHost.addTab(tabSpec1);
        tabHost.addTab(tabSpec2);

        joinedForumsViews = new ArrayList<>();
        allForumsViews = new ArrayList<>();
        generateJoinedForums();

        tabHost.setOnTabChangedListener(tabId -> {
            if (tabId.equals("Tab1")) {
                resetAdnAddView(findViewById(R.id.forum_layout_joined), joinedForumsViews);
            } else {
                resetAdnAddView(findViewById(R.id.forum_layout_all), allForumsViews);
            }
        });

        findViewById(R.id.addForumButton).setOnClickListener(v -> {
            final Dialog dialog = new Dialog(ForumActivity.this);
            dialog.setContentView(R.layout.add_forum_dialog); // Use your custom layout

            Window window = dialog.getWindow();
            if (window != null) {
                window.setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            }

            // Show the dialog
            dialog.show();
        });
    }

    private void generateJoinedForums() {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                joinedForums = response.getAsJsonArray();
                for(int i = 0;  i < joinedForums.size(); i++) {
                    JsonObject forum = joinedForums.get(i).getAsJsonObject();
                    Log.d("ForumActivity", forum.toString());
                    View joinedForumsView = getLayoutInflater().inflate(R.layout.forum_card, null);
                    joinedForumsView.setTag(forum.get("forumId").getAsString());
                    ((TextView) joinedForumsView.findViewById(R.id.new_forum_name)).setText(forum.get("name").getAsString());
                    ((TextView) joinedForumsView.findViewById(R.id.course_name)).setText(forum.get("course").getAsString());

                    ((Button) joinedForumsView.findViewById(R.id.join_button)).setText(R.string.joined_button);
                    joinedForumsView.findViewById(R.id.join_button).setEnabled(false);

                    joinedForumsView.setOnClickListener(v -> {
                        Intent intent = new Intent(ForumActivity.this, ForumViewActivity.class);
                        intent.putExtra("forumId", (String) joinedForumsView.getTag());
                        intent.putExtra("isJoined", true);
                        intent.putExtra("forumName", forum.get("name").getAsString());
                        startActivity(intent);
                    });

                    joinedForumsViews.add(joinedForumsView);
                }

                generateAllForums();
                resetAdnAddView(findViewById(R.id.forum_layout_joined), joinedForumsViews);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/forums/user", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private void generateAllForums() {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                for(int i = 0;  i < response.getAsJsonArray().size(); i++) {
                    JsonObject forum = response.getAsJsonArray().get(i).getAsJsonObject();
                    Log.d("ForumActivity", forum.toString());
                    View addForumsView = getLayoutInflater().inflate(R.layout.forum_card, null);
                    addForumsView.setTag(forum.get("forumId").getAsString());
                    ((TextView) addForumsView.findViewById(R.id.new_forum_name)).setText(forum.get("name").getAsString());
                    ((TextView) addForumsView.findViewById(R.id.course_name)).setText(forum.get("course").getAsString());

                    boolean isJoined = joinedForums.contains(forum);
                    if (isJoined) {
                        ((Button) addForumsView.findViewById(R.id.join_button)).setText(R.string.joined_button);
                        addForumsView.findViewById(R.id.join_button).setEnabled(false);
                    }

                    addForumsView.findViewById(R.id.join_button).setOnClickListener(v -> {
                        joinNewForum((String) addForumsView.getTag());
                    });

                    addForumsView.setOnClickListener(v -> {
                        Intent intent = new Intent(ForumActivity.this, ForumViewActivity.class);
                        intent.putExtra("forumId", (String) v.getTag());
                        intent.putExtra("isJoined", isJoined);
                        startActivity(intent);
                    });

                    allForumsViews.add(addForumsView);
                }
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/forums", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private void resetAdnAddView(LinearLayout layout, ArrayList<View> views) {
        layout.removeAllViewsInLayout();
        for (View view : views)
            layout.addView(view);
    }

    private void joinNewForum(String forumId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                ForumActivity.this.recreate();
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            JsonObject body = new JsonObject();
            body.addProperty("forumId", forumId);
            serverRequest.makePostRequest("/forums/user", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}