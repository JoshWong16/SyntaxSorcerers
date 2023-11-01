package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;

import com.example.frontend.apiwrappers.ServerRequest;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;

public class LoginActivity extends AppCompatActivity {

    private GoogleSignInClient mGoogleSignInClient;
    private final int RC_SIGN_IN = 1;
    final static String TAG = "LoginActivity";

    /* ChatGPT usage: No */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Button loginButton = findViewById(R.id.login_button);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        loginButton.setOnClickListener(view -> signIn());
    }

    /* ChatGPT usage: No */
    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    /* ChatGPT usage: No */
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener.
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    /* ChatGPT usage: No */
    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount account = completedTask.getResult(ApiException.class);

            // Signed in successfully, show authenticated UI.
            checkIfUserExists(account);
        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
        }
    }

    /* ChatGPT usage: Partial */
    private void checkIfUserExists(GoogleSignInAccount account) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("accountName", account.getDisplayName());
        editor.putString("accountDisplayImage", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : "");
        editor.putString("userId", account.getId());
        editor.apply();

        ServerRequest serverRequest = new ServerRequest(account.getId());
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
               if (response.isJsonNull()) {
                   Log.d(TAG, "User does not exist");
                   createAccount(account);
               } else {
                   FirebaseMessaging.getInstance().getToken()
                           .addOnCompleteListener(task -> {
                               if (!task.isSuccessful()) {
                                   Log.w(TAG, "Fetching FCM registration token failed", task.getException());
                                   return;
                               }

                               // Get new FCM registration token
                               String token = task.getResult();
                               Log.d(TAG, "Token: " + token);
                               putLatestToken(token, account);
                           });
               }
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
            throw new RuntimeException(e);
        }
    }

    /* ChatGPT usage: Partial */
    private void putLatestToken(String token, GoogleSignInAccount account) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        JsonObject body = new JsonObject();
        body.addProperty("notification_token", token);
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(TAG, "User does exist");
                Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                intent.putExtra("userId", account.getId());
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

    /* ChatGPT usage: No */
    private void createAccount(GoogleSignInAccount account) {
        Intent intent = new Intent(LoginActivity.this, SignupActivity.class);
        intent.putExtra("email", account.getEmail());
        Log.d(TAG, account.getId() + " not null");
        intent.putExtra("userId", account.getId());
        startActivity(intent);
    }
}