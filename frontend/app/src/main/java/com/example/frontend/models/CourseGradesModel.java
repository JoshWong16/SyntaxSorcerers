package com.example.frontend.models;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.Map;

@Data
public class CourseGradesModel {
    @SerializedName("average")
    private double average;

    @SerializedName("campus")
    private String campus;

    @SerializedName("course")
    private String course;

    @SerializedName("course_title")
    private String courseTitle;

    @SerializedName("detail")
    private String detail;

    @SerializedName("educators")
    private String educators;

    @SerializedName("faculty_title")
    private String facultyTitle;

    @SerializedName("grades")
    private Map<String, Integer> grades;

    @SerializedName("high")
    private int high;

    @SerializedName("low")
    private int low;

    @SerializedName("median")
    private double median;

    @SerializedName("percentile_25")
    private double percentile25;

    @SerializedName("percentile_75")
    private double percentile75;

    @SerializedName("reported")
    private int reported;

    @SerializedName("section")
    private String section;

    @SerializedName("session")
    private String session;

    @SerializedName("subject")
    private String subject;

    @SerializedName("subject_title")
    private String subjectTitle;

    @SerializedName("year")
    private String year;
}