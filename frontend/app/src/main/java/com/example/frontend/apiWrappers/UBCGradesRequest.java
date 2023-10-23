package com.example.frontend.apiWrappers;

import android.util.Log;

import com.example.frontend.CourseSearchActivity;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Path;
import retrofit2.http.Url;

public class UBCGradesRequest {
    public static final String RequestTag = "Requests";
    private static final String BASE_URL = "https://ubcgrades.com/"; // Replace with your API base URL

    private Retrofit retrofit;
    private ApiService apiService;

    public UBCGradesRequest() {
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);
    }

    public void makeGetRequest(String endpoint, final ApiRequestListener listener) throws UnsupportedEncodingException {
        Call<JsonArray> call = apiService.getData(endpoint);
        Log.d(RequestTag, call.request().url().toString());
        call.enqueue(new Callback<JsonArray>() {
            @Override
            public void onResponse(Call<JsonArray> call, Response<JsonArray> response) {
                if (response.isSuccessful()) {
                    JsonArray jsonResponseObject = response.body();
                    Log.d(RequestTag, jsonResponseObject.toString());
                    listener.onApiRequestComplete(jsonResponseObject);
                } else {
                    listener.onApiRequestError("Error response: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<JsonArray> call, Throwable t) {
                listener.onApiRequestError(t.getMessage());
            }
        });
    }

    public interface ApiRequestListener {
        void onApiRequestComplete(JsonArray response);
        void onApiRequestError(String error);
    }

    private interface ApiService {
        @GET
        Call<JsonArray> getData(@Url String endpoint);
    }
}
