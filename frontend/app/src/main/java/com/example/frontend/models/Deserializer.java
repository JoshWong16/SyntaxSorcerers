package com.example.frontend.models;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class Deserializer {
    public CourseGradesModel courseGradesModelDeserialize(JsonObject json) {
        Gson gson = new Gson();
        CourseGradesModel courseData = gson.fromJson(json, CourseGradesModel.class);
        return courseData;
    }
}
