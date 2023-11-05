package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CompoundButton;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.example.frontend.apiwrappers.ServerRequest;
import com.example.frontend.apiwrappers.UBCGradesRequest;
import com.example.frontend.models.CourseGradesModel;
import com.example.frontend.models.Deserializer;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;
import com.google.android.material.switchmaterial.SwitchMaterial;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class CourseSearchActivity extends AppCompatActivity {
    private final String[] availableYearSessions = {"", "2023S", "2022W", "2022S", "2021W", "2021S"};
    private final String BASE_URI = "/api/v3/";
    private final String CAMPUS = "UBCV";
    private final int NUM_SPINNERS = 4;

    private String[] spinnerURIs = {"subjects", "courses", "sections", "grades"};
    private String[] spinnerItems = new String[4];

    private int[] spinnerIds = {R.id.yearSession, R.id.subject, R.id.course, R.id.section};
    private ArrayAdapter<String>[] adapters = new ArrayAdapter[NUM_SPINNERS];

    private TextView courseName;
    private TextView average;
    private TextView stats;
    private TextView teachers;
    private TextView enrolled;
    private CourseGradesModel courseGradesModel;
    private SwitchMaterial favouriteSwitch;
    private BarChart barChart;

    /**
     * ChatGPT Usage: Partial
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course_search);
        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        Spinner[] spinners = new Spinner[NUM_SPINNERS];
        courseName = findViewById(R.id.courseName);
        average = findViewById(R.id.average);
        stats = findViewById(R.id.stats);
        teachers = findViewById(R.id.teachers);
        enrolled = findViewById(R.id.enrolled);
        barChart = findViewById(R.id.barChart);

        favouriteSwitch = findViewById(R.id.favSwitch);
        initializeFavouriteSwitch(favouriteSwitch);

        for (int i=0; i < NUM_SPINNERS; i++) {
            spinners[i] = findViewById(spinnerIds[i]);
            if (i == 0) adapters[i] = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, availableYearSessions);
            else adapters[i] = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item);
            adapters[i].setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
            spinners[i].setAdapter(adapters[i]);
            final int spinnerIndex = i;
            spinners[i].setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                    String selectedItem = adapters[spinnerIndex].getItem(position);
                    if (!selectedItem.equals("")) {
                        updateOtherSpinnersOnChange(selectedItem, spinnerIndex);
                        updateNextSpinnerWithApiData(spinnerIndex);
                    }
                }

                @Override
                public void onNothingSelected(AdapterView<?> parentView) {
                    // Do nothing here
                }
            });
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void updateNextSpinnerWithApiData(int currentSpinnerIndex) {
        if (currentSpinnerIndex < 4) {
            String apiEndpoint = constructEndpoint(currentSpinnerIndex);
            if (currentSpinnerIndex < 3) callUBCGradesJsonArray(currentSpinnerIndex, apiEndpoint);
            else callUBCGradesJsonObject(apiEndpoint);
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void updateSpinnerWithData(JsonArray responseData, int spinnerIndex) {
        if (spinnerIndex < 4) {
            adapters[spinnerIndex].clear();

            adapters[spinnerIndex].add("");
            for (int i = 0; i < responseData.size(); i++) {
                if (spinnerIndex == 1) {
                    adapters[spinnerIndex].add(
                            responseData.get(i).getAsJsonObject().get("subject").getAsString());
                } else if (spinnerIndex == 2) {
                    adapters[spinnerIndex].add(
                            responseData.get(i).getAsJsonObject().get("course").getAsString()
                            + responseData.get(i).getAsJsonObject().get("detail").getAsString());
                } else if (spinnerIndex == 3) {
                    adapters[spinnerIndex].add(responseData.get(i).getAsString());
                }
            }

            adapters[spinnerIndex].notifyDataSetChanged();
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void updateOtherSpinnersOnChange(String selectedItem,int spinnerIndex) {
        spinnerItems[spinnerIndex] = selectedItem;
        for (int i = spinnerIndex + 1; i < NUM_SPINNERS; i++) {
            spinnerItems[i] = "";
            adapters[i].clear();
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private String constructEndpoint(int spinnerIndex) {
        StringBuilder endpoint = new StringBuilder(BASE_URI);
        endpoint.append(spinnerURIs[spinnerIndex]);
        endpoint.append("/" + CAMPUS);
        for (int i = 0; i < spinnerIndex+1; i++) {
            endpoint.append("/" + spinnerItems[i]);
        }
        return endpoint.toString();
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void callUBCGradesJsonArray(int currentSpinnerIndex, String apiEndpoint) {
        UBCGradesRequest ubcGradesRequest = new UBCGradesRequest();
        UBCGradesRequest.ApiRequestListener apiRequestListener = new UBCGradesRequest.ApiRequestListener<JsonArray>() {
            @Override
            public void onApiRequestComplete(JsonArray response) {
                updateSpinnerWithData(response, currentSpinnerIndex + 1);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(UBCGradesRequest.RequestTag, "Failure");
                Log.d(UBCGradesRequest.RequestTag, error);
            }
        };
        ubcGradesRequest.makeGetRequestForJsonArray(apiEndpoint, apiRequestListener);
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void callUBCGradesJsonObject(String apiEndpoint) {
        UBCGradesRequest ubcGradesRequest = new UBCGradesRequest();
        UBCGradesRequest.ApiRequestListener apiRequestListener = new UBCGradesRequest.ApiRequestListener<JsonObject>() {
            @Override
            public void onApiRequestComplete(JsonObject response) {
                Log.d(UBCGradesRequest.RequestTag, "Course grade request success");
                Deserializer deserializer = new Deserializer();
                courseGradesModel = deserializer.courseGradesModelDeserialize(response);
                setSwitchState();
                favouriteSwitch.setVisibility(View.VISIBLE);

                displaySearchResults(courseGradesModel);
                displayGraph(courseGradesModel.getGrades());
            }
            @Override
            public void onApiRequestError(String error) {
                Log.d(UBCGradesRequest.RequestTag, "Failure");
                Log.d(UBCGradesRequest.RequestTag, error);
            }
        };
        try {
            ubcGradesRequest.makeGetRequestForJsonObject(apiEndpoint, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void displaySearchResults(CourseGradesModel data) {
        courseName.setText(String.format("%s %s%s %s %s %s",
                data.getCampus(), data.getYear(), data.getSession(),
                data.getSubject(), data.getCourse(), data.getSection()));
        average.setText(String.format("Average: %s", data.getAverage()));
        stats.setText(String.format("Median: %s, High: %s, Low: %s",
                data.getMedian(), data.getHigh(), data.getLow()));
        teachers.setText(String.format("Teaching Team: %s",
                data.getEducators()));
        enrolled.setText(String.format("Number of students enrolled: %s",
                data.getReported()));
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void displayGraph(Map<String, Integer> data) {
        ArrayList<BarEntry> entries = new ArrayList<>();
        ArrayList<String> xAxisLabels = new ArrayList<>();
        int index = 1;
        int val = 0;
        for (Map.Entry<String, Integer> entry : data.entrySet()) {
            xAxisLabels.add(entry.getKey());
            entries.add(new BarEntry(index, entry.getValue()));
            val = entry.getValue();
            index++;
        }

        entries.remove(entries.size()-1);
        entries.add(0, new BarEntry(0, val));
        xAxisLabels.add(0, xAxisLabels.remove(xAxisLabels.size()-1));
        BarDataSet dataSet = new BarDataSet(entries, "Values");
        dataSet.setColor(Color.BLUE);
        BarData barData = new BarData(dataSet);

        barChart.getLegend().setEnabled(false);
        barChart.getDescription().setEnabled(false);
        YAxis rightYAxis = barChart.getAxisRight();
        rightYAxis.setEnabled(false);

        YAxis yAxis = barChart.getAxisLeft();
        yAxis.setDrawGridLines(false);

        XAxis xAxis = barChart.getXAxis();
        xAxis.setDrawGridLines(false);
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextSize(8f);
        dataSet.setValueTextSize(0f);
        xAxis.setValueFormatter(new IndexAxisValueFormatter(xAxisLabels));

        barChart.setOnChartValueSelectedListener(new OnChartValueSelectedListener() {
            @Override
            public void onValueSelected(Entry e, Highlight h) {
                dataSet.setValueTextSize(12f);
                barChart.invalidate();
            }
            @Override
            public void onNothingSelected() {
                dataSet.setValueTextSize(0f);
            }
        });
        barChart.setData(barData);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                barChart.invalidate();
            }
        });
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void initializeFavouriteSwitch(SwitchMaterial switchMaterial) {
        switchMaterial.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                String courseId = String.format("%s %s", courseGradesModel.getSubject(), courseGradesModel.getCourse());
                if (isChecked) {
                    addFavouriteCourse(courseId);
                } else {
                    removeCourse(courseId);
                }
            }
        });
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void addFavouriteCourse(String courseId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);
        JsonObject body = new JsonObject();
        body.addProperty("courseId", courseId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Toast.makeText(CourseSearchActivity.this, courseId + " favourited", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makePostRequest("/users/favourite", body, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void removeCourse(String courseId) {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        ServerRequest serverRequest = new ServerRequest(userId);

        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Toast.makeText(CourseSearchActivity.this, courseId + " unfavourited", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeDeleteRequest("/users/favourite/" + courseId, apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
    }

    /**
     * ChatGPT Usage: No
     */
    private void setSwitchState() {
        SharedPreferences sharedPreferences = getSharedPreferences("GoogleAccountInfo", MODE_PRIVATE);
        String userId = sharedPreferences.getString("userId", null);
        String courseId = String.format("%s %s", courseGradesModel.getSubject(), courseGradesModel.getCourse());
        getUserCourses(userId, courseId);
    }

    /**
     * ChatGPT Usage: No
     */
    private Set<String> getUserCourses(String userId, String courseId) {
        ServerRequest serverRequest = new ServerRequest(userId);
        Set<String> userCourses = new HashSet<>();
        ServerRequest.ApiRequestListener apiRequestListener = new ServerRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                for (JsonElement course : response.getAsJsonArray()) {
                    userCourses.add(course.getAsString());
                }
                favouriteSwitch.setChecked(userCourses.contains(courseId));
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(ServerRequest.RequestTag, "Failure");
                Log.d(ServerRequest.RequestTag, error);
            }
        };

        try {
            serverRequest.makeGetRequest("/users/favourite", apiRequestListener);
        } catch (UnsupportedEncodingException e) {
            throw new InternalError(e);
        }
        return userCourses;
    }
}