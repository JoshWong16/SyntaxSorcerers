package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.frontend.apiWrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class ForumViewActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forum_view);

        String forumId = getIntent().getStringExtra("forumId");
        boolean isJoined = getIntent().getBooleanExtra("isJoined", false);
        String forumName = getIntent().getStringExtra("forumName");

        getAllPosts(forumId);

        if (!isJoined) {
            ((Button) findViewById(R.id.leaveAndJoinButton)).setText(R.string.join_button);
        }

        ((TextView) findViewById(R.id.forumName)).setText(forumName);

        findViewById(R.id.leaveAndJoinButton).setOnClickListener(v -> {
            //TODO: add leave and join functionality
        });

        findViewById(R.id.create_button).setOnClickListener(v -> {
            addPost(forumId);
        });
    }

    private void addPost(String forumId) {
        // TODO: implement add post functionality. Copy from addComment
    }

    private void getAllPosts(String forumId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("Posts", response.toString());
                for(int i = 0;  i < response.getAsJsonArray().size(); i++) {
                    JsonObject post = response.getAsJsonArray().get(i).getAsJsonObject();
                    Log.d("ForumViewActivity", post.toString());
                    View postView = getLayoutInflater().inflate(R.layout.post_card, null);
                    postView.setTag(post.get("postId").getAsString());
                    ((TextView) postView.findViewById(R.id.post_user)).setText(post.get("writtenBy").getAsString());
                    ((TextView) postView.findViewById(R.id.post_content)).setText(post.get("content").getAsString());
                    ((TextView) postView.findViewById(R.id.number_of_likes)).setText(post.get("likesCount").getAsString());
                    ((TextView) postView.findViewById(R.id.number_of_comments)).setText(post.get("commentCount").getAsString());

                    SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
                    SimpleDateFormat outputFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss", Locale.US);
                    Date date = inputFormat.parse(post.get("dateWritten").getAsString());
                    assert date != null;
                    String formattedDate = outputFormat.format(date);
                    Log.d("ForumViewActivity", formattedDate);
                    ((TextView) postView.findViewById(R.id.post_date)).setText(formattedDate);

                    if (post.get("userLiked").getAsBoolean()) {
                        ((ImageButton) postView.findViewById(R.id.like_button)).setImageResource(R.drawable.baseline_thumb_up_alt_24);
                    }

                    postView.setOnClickListener(v -> {
                        goToPostPage(post, formattedDate);
                    });

                    postView.findViewById(R.id.comment_button).setOnClickListener(v -> {
                        goToPostPage(post, formattedDate);
                    });

                    ImageButton likeButton = postView.findViewById(R.id.like_button);
                    likeButton.setOnClickListener(v -> {
                        // TODO: add call to remove and add like
                        ForumViewActivity.this.recreate();
                    });

                    ((LinearLayout) findViewById(R.id.postsLayoutAll)).addView(postView);
                }
            }

            private void goToPostPage(JsonObject post, String date) {
                Intent intent = new Intent(ForumViewActivity.this, PostActivity.class);
                intent.putExtra("postId", post.get("postId").getAsString());
                intent.putExtra("writtenBy", post.get("writtenBy").getAsString());
                intent.putExtra("content", post.get("content").getAsString());
                intent.putExtra("likesCount", post.get("likesCount").getAsString());
                intent.putExtra("commentCount", post.get("commentCount").getAsString());
                intent.putExtra("userLiked", post.get("userLiked").getAsBoolean());
                intent.putExtra("date", date);
                startActivity(intent);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/posts/" + forumId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}