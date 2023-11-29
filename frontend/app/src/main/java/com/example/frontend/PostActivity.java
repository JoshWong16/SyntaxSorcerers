package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class PostActivity extends AppCompatActivity {

    private SwipeRefreshLayout swipeRefreshLayout;
    /* ChatGPT usage: Partial */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_post);

        Intent intent = getIntent();
        String userId = intent.getStringExtra("userId");
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
            addComment(postId, v);
        });

        findViewById(R.id.report_button).setOnClickListener(v -> {
            showReportPostsDialog(postId, userId);
        });

        swipeRefreshLayout = findViewById(R.id.comments_refresh_layout);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                Log.d("PostActivity", "Refreshing");
                swipeRefreshLayout.setRefreshing(false);
            }
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
            throw new InternalError(e);
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
            throw new InternalError(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void addComment(String postId, View view) {
        String comment = (((EditText) findViewById(R.id.commentMessage)).getText()).toString();
        if (comment.trim().equals("")) {
            InputMethodManager inputMethodManager = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getApplicationWindowToken(),0);
            Toast.makeText(PostActivity.this, "Please enter a post", Toast.LENGTH_SHORT).show();
            return;
        } else if (comment.length() > 20000) {
            InputMethodManager inputMethodManager = (InputMethodManager)getSystemService(INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getApplicationWindowToken(),0);
            Toast.makeText(PostActivity.this, "Post is too long, needs to be less than 20,000 characters", Toast.LENGTH_SHORT).show();
            return;
        }

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
            throw new InternalError(e);
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
            throw new InternalError(e);
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
            throw new InternalError(e);
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

        commentView.findViewById(R.id.report_button).setOnClickListener(v -> {

            showReportCommentsDialog(comment.get("commentId").getAsString(), comment.get("userId").getAsString());
        });
    }

    /* ChatGPT usage: No */
    /* https://www.geeksforgeeks.org/how-to-create-an-alert-dialog-box-in-android/ */
    private void showReportPostsDialog(String postId, String userId) {
        AlertDialog.Builder builder = new AlertDialog.Builder(PostActivity.this);

        builder.setTitle("Report Post");
        builder.setMessage("Are you sure you want to report this post?");

        builder.setCancelable(false);

        builder.setPositiveButton("Yes", (DialogInterface.OnClickListener) (dialog, which) -> {
            /* https request to report the post here */
            SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
            String userIdReporter = sharedPreferences.getString("userId", null);
            ServerRequest serverRequest = new ServerRequest(userIdReporter);
            ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
                @Override
                public void onApiRequestComplete(JsonElement response) {
                    Log.d(ServerRequest.RequestTag, "Success");

                    /* dialog closes */
                    dialog.cancel();

                    Toast.makeText(PostActivity.this, "Post has been reported.", Toast.LENGTH_SHORT).show();

                }

                @Override
                public void onApiRequestError(String error) {
                    Log.d(ServerRequest.RequestTag, "Failure");
                    Log.d(ServerRequest.RequestTag, error);
                }
            };

            JsonObject body = new JsonObject();
            body.addProperty("postId", postId);
            body.addProperty("userId", userId);
            Log.d("PostActivity", postId);

            try {
                serverRequest.makePostRequest("/reports/", body, apiRequestListener);
            } catch (UnsupportedEncodingException e) {
                throw new InternalError(e);
            }
        });

        builder.setNegativeButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {

            /* dialog closes */
            dialog.cancel();
        });

        AlertDialog alertDialog = builder.create();

        alertDialog.show();

    }

    /* ChatGPT usage: No */
    /* https://www.geeksforgeeks.org/how-to-create-an-alert-dialog-box-in-android/ */
    private void showReportCommentsDialog(String commentId, String userId) {
        AlertDialog.Builder builder = new AlertDialog.Builder(PostActivity.this);

        builder.setTitle("Report Comment");
        builder.setMessage("Are you sure you want to report this comment?");

        builder.setCancelable(false);

        builder.setPositiveButton("Yes", (DialogInterface.OnClickListener) (dialog, which) -> {
            /* https request to report the post here */
            SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
            String userIdReporter = sharedPreferences.getString("userId", null);
            ServerRequest serverRequest = new ServerRequest(userIdReporter);
            ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
                @Override
                public void onApiRequestComplete(JsonElement response) {
                    Log.d(ServerRequest.RequestTag, "Success");

                    /* dialog closes */
                    dialog.cancel();

                    Toast.makeText(PostActivity.this, "Comment has been reported.", Toast.LENGTH_SHORT).show();

                }

                @Override
                public void onApiRequestError(String error) {
                    Log.d(ServerRequest.RequestTag, "Failure");
                    Log.d(ServerRequest.RequestTag, error);
                }
            };

            JsonObject body = new JsonObject();
            body.addProperty("commentId", commentId);
            body.addProperty("userId", userId);
            Log.d("PostActivity", commentId);

            try {
                serverRequest.makePostRequest("/reports/", body, apiRequestListener);
            } catch (UnsupportedEncodingException e) {
                throw new InternalError(e);
            }
        });

        builder.setNegativeButton("Cancel", (DialogInterface.OnClickListener) (dialog, which) -> {

            /* dialog closes */
            dialog.cancel();
        });

        AlertDialog alertDialog = builder.create();

        alertDialog.show();

    }
}