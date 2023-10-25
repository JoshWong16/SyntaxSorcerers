package com.example.frontend.apiWrappers;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.gson.JsonElement;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Url;

public class ServerRequest {

    public static final String RequestTag = "Server Requests";
    private static final String BASE_URL = "http://192.168.0.145:8080/"; // Replace with your API base URL

    private Retrofit retrofit;
    private ApiService apiService;

    public ServerRequest(String userId) {
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(new Interceptor() {
            @NonNull
            @Override
            public okhttp3.Response intercept(@NonNull Chain chain) throws IOException {
                Request newRequest  = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer " + userId)
                        .build();
                return chain.proceed(newRequest);
            }
        }).build();

        retrofit = new Retrofit.Builder()
                .client(client)
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);
    }

    public void makeGetRequest(String endpoint, final ServerRequest.ApiRequestListener listener) throws UnsupportedEncodingException {
        Call<JsonElement> call = apiService.getData(endpoint);
        callHandler(listener, call);
    }

    public void makePostRequest(String endpoint, JsonElement body, final ServerRequest.ApiRequestListener listener) throws UnsupportedEncodingException {
        Call<JsonElement> call = apiService.postData(endpoint, body);
        callHandler(listener, call);
    }

    public void makePutRequest(String endpoint, JsonElement body, final ServerRequest.ApiRequestListener listener) throws UnsupportedEncodingException {
        Call<JsonElement> call = apiService.putData(endpoint, body);
        callHandler(listener, call);
    }

    public void makeDeleteRequest(String endpoint, final ServerRequest.ApiRequestListener listener) throws UnsupportedEncodingException {
        Call<JsonElement> call = apiService.deleteData(endpoint);
        callHandler(listener, call);
    }

    private static void callHandler(ApiRequestListener listener, Call<JsonElement> call) {
        Log.d(RequestTag, call.request().url().toString());
        call.enqueue(new Callback<JsonElement>() {
            @Override
            public void onResponse(Call<JsonElement> call, Response<JsonElement> response) {
                if (response.isSuccessful()) {
                    JsonElement jsonResponse = response.body();
                    Log.d(RequestTag, jsonResponse.toString());
                    listener.onApiRequestComplete(jsonResponse);
                } else {
                    listener.onApiRequestError("Error response: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonElement> call, Throwable t) {
                listener.onApiRequestError(t.getMessage());
            }
        });
    }

    public interface ApiRequestListener {
        void onApiRequestComplete(JsonElement response);
        void onApiRequestError(String error);
    }

    private interface ApiService {
        @GET
        Call<JsonElement> getData(@Url String endpoint);
        @POST
        Call<JsonElement> postData(@Url String endpoint, @Body JsonElement data);

        @PUT
        Call<JsonElement> putData(@Url String endpoint, @Body JsonElement data);

        @DELETE
        Call<JsonElement> deleteData(@Url String endpoint);
    }
}
