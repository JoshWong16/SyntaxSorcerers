package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class PostActivity extends AppCompatActivity {

    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post);

        Intent intent = getIntent();
        String postId = intent.getStringExtra("postId");
        String writtenBy = intent.getStringExtra("writtenBy");
        String content = intent.getStringExtra("content");
        String likesCount = intent.getStringExtra("likesCount");
        String commentCount = intent.getStringExtra("commentCount");
        boolean userLiked = intent.getBooleanExtra("userLiked", false);
        String date = intent.getStringExtra("date");


        ((TextView) findViewById(R.id.post_user)).setText(writtenBy);
        ((TextView) findViewById(R.id.post_content)).setText(content);
        ((TextView) findViewById(R.id.number_of_likes)).setText(likesCount);
        ((TextView) findViewById(R.id.number_of_comments)).setText(commentCount);
        ((TextView) findViewById(R.id.post_date)).setText(date);

        if (userLiked) {
            ((ImageButton) findViewById(R.id.like_button)).setImageResource(R.drawable.baseline_thumb_up_alt_24);
        }

        findViewById(R.id.like_button).setOnClickListener(v -> {
            ImageButton imageButton = findViewById(R.id.like_button);
            Drawable imageResource = imageButton.getDrawable();
            Drawable.ConstantState imageButtonState = imageResource.getConstantState();
            Drawable desiredDrawable = getResources().getDrawable(R.drawable.baseline_thumb_up_alt_24);
            Drawable.ConstantState desiredDrawableState = desiredDrawable.getConstantState();
            assert imageButtonState != null;
            if (imageButtonState.equals(desiredDrawableState)) {
                removeLike(postId);
            } else {
                addLike(postId);
            }
        });

        findViewById(R.id.create_forum_button).setOnClickListener(v -> {
            addComment(postId);
        });

        getComments(postId);
    }

    /* ChatGPT usage: No */
    /* https://stackoverflow.com/questions/5545217/back-button-and-refreshing-previous-activity */
    @Override
    public void onRestart()
    {
        super.onRestart();
        finish();
        startActivity(getIntent());
    }

    /* ChatGPT usage: Partial */
    private void addLike(String postId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");
                ((ImageButton) findViewById(R.id.like_button)).setImageResource(R.drawable.baseline_thumb_up_alt_24);
                TextView numberOfLikes = findViewById(R.id.number_of_likes);
                int val = Integer.parseInt((String) numberOfLikes.getText()) + 1;
                numberOfLikes.setText(String.valueOf(val));
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        JsonObject body = new JsonObject();
        body.addProperty("post_id", postId);
        try {
            serverRequest.makePostRequest("/likes", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void removeLike(String postId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(ServerRequest.RequestTag, "Success");
                ((ImageButton) findViewById(R.id.like_button)).setImageResource(R.drawable.baseline_thumb_up_off_alt_24);
                TextView numberOfLikes = findViewById(R.id.number_of_likes);
                int val = Integer.parseInt((String) numberOfLikes.getText()) - 1;
                numberOfLikes.setText(String.valueOf(val));
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeDeleteRequest("/likes/" + postId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void addComment(String postId) {
        String comment = (((EditText) findViewById(R.id.commentMessage)).getText()).toString();
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @SuppressLint("UnsafeIntentLaunch")
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d(ServerRequest.RequestTag, "Success");
                findViewById(R.id.commentMessage).clearFocus();
                ((EditText) findViewById(R.id.commentMessage)).setText("");
                TextView numberOfComments = findViewById(R.id.number_of_comments);
                int val = Integer.parseInt((String) numberOfComments.getText()) + 1;
                numberOfComments.setText(String.valueOf(val));
                getComment(response.getAsJsonObject().get("commentId").getAsString());
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        JsonObject body = new JsonObject();
        body.addProperty("content", comment);
        body.addProperty("postId", postId);
        try {
            serverRequest.makePostRequest("/comments", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void getComment(String commentId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("Comments", response.toString());
                makeCommentView(response.getAsJsonObject());
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/comments/comment/" + commentId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void getComments(String postId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) throws ParseException {
                Log.d("Comments", response.toString());
                for(int i = 0;  i < response.getAsJsonArray().size(); i++) {
                    JsonObject comment = response.getAsJsonArray().get(i).getAsJsonObject();
                    Log.d("ForumViewActivity", comment.toString());
                    makeCommentView(comment);
                }
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/comments/" + postId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void makeCommentView(JsonObject comment) throws ParseException {
        View commentView = getLayoutInflater().inflate(R.layout.comment_card, null);
        commentView.setTag(comment.get("commentId").getAsString());
        ((TextView) commentView.findViewById(R.id.comment_user)).setText(comment.get("writtenBy").getAsString());
        ((TextView) commentView.findViewById(R.id.comment_content)).setText(comment.get("content").getAsString());

        SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        SimpleDateFormat outputFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss", Locale.US);
        Date date = inputFormat.parse(comment.get("dateWritten").getAsString());
        assert date != null;
        String formattedDate = outputFormat.format(date);
        Log.d("ForumViewActivity", formattedDate);
        ((TextView) commentView.findViewById(R.id.comment_date)).setText(formattedDate);

        ((LinearLayout) findViewById(R.id.commentLayout)).addView(commentView, 0);
    }
}