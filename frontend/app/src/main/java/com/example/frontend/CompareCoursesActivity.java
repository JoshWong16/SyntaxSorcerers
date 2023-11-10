package com.example.frontend;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.example.frontend.apiwrappers.UBCGradesRequest;
import com.example.frontend.models.CourseGradesModel;
import com.example.frontend.models.Deserializer;
import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.LegendEntry;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.Map;

public class CompareCoursesActivity extends AppCompatActivity {
    private final String[] availableYearSessions = {"", "2023S", "2022W", "2022S", "2021W", "2021S"};
    private final String BASE_URI = "/api/v3/";
    private final String CAMPUS = "UBCV";
    private final int NUM_SPINNERS = 4;

    private String[] spinnerURIs = {"subjects", "courses", "sections", "grades"};
    private String[] spinner1Items = new String[4];

    private Spinner[] spinners1 = new Spinner[NUM_SPINNERS];
    private int[] spinnerIds1 = {R.id.yearSession1, R.id.subject1, R.id.course1, R.id.section1};
    private ArrayAdapter<String>[] adapters1 = new ArrayAdapter[NUM_SPINNERS];

    private String[] spinner2Items = new String[4];

    private Spinner[] spinners2 = new Spinner[NUM_SPINNERS];
    private int[] spinnerIds2 = {R.id.yearSession2, R.id.subject2, R.id.course2, R.id.section2};
    private ArrayAdapter<String>[] adapters2 = new ArrayAdapter[NUM_SPINNERS];

    private TextView[] firstCourseTextViews = new TextView[5];
    private TextView[] secondCourseTextViews = new TextView[5];

    private int[] firstCourseTextViewIds = {R.id.courseName1, R.id.average1, R.id.stats1, R.id.teachers1, R.id.enrolled1};
    private int[] secondCourseTextViewIds = {R.id.courseName2, R.id.average2, R.id.stats2, R.id.teachers2, R.id.enrolled2};

    CourseGradesModel course1GradesModel;
    CourseGradesModel course2GradesModel;
    private BarChart barChart;


    /**
     * ChatGPT Usage: Partial
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_compare_courses);
        BottomNavMenu.createBottomNavMenu(this, findViewById(R.id.bottom_navigation), R.id.action_home);

        barChart = findViewById(R.id.barChart1);

        initializeSpinners(spinners1, spinnerIds1, adapters1, spinner1Items,  1);
        initializeSpinners(spinners2, spinnerIds2, adapters2, spinner2Items,  2);

        initializeTextViews(firstCourseTextViews, firstCourseTextViewIds);
        initializeTextViews(secondCourseTextViews, secondCourseTextViewIds);

        Button compareCoursesButton = findViewById(R.id.compareButton);
        initializeCompareButton(compareCoursesButton);
    }

    /**
     * ChatGPT Usage: No
     */
    private void initializeTextViews(TextView[] textViews, int[] ids) {
        for (int i = 0; i < textViews.length; i++) {
            textViews[i] = findViewById(ids[i]);
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void initializeSpinners(Spinner[] spinners, int[] spinnerIds, ArrayAdapter<String>[] adapters, String[] spinnerItems, int searchbar) {
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
                        updateOtherSpinnersOnChange(selectedItem, spinnerIndex, spinnerItems, adapters);
                        updateNextSpinnerWithApiData(spinnerIndex, spinnerItems, adapters, searchbar);
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
     * ChatGPT Usage: No
     */
    private void updateOtherSpinnersOnChange(String selectedItem, int spinnerIndex, String[] spinnerItems, ArrayAdapter<String>[] adapters) {
        spinnerItems[spinnerIndex] = selectedItem;
        for (int i = spinnerIndex + 1; i < NUM_SPINNERS; i++) {
            spinnerItems[i] = "";
            adapters[i].clear();
        }
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void updateNextSpinnerWithApiData(int currentSpinnerIndex, String[] spinnerItems, ArrayAdapter<String>[] adapters, int searchbar) {
        if (currentSpinnerIndex < 4) {
            String apiEndpoint = constructEndpoint(currentSpinnerIndex, spinnerItems);
            if (currentSpinnerIndex < 3) callUBCGradesJsonArray(currentSpinnerIndex, apiEndpoint, adapters);
            else callUBCGradesJsonObject(apiEndpoint, searchbar);
        }
    }

    /**
     * ChatGPT Usage: No
     */
    private String constructEndpoint(int spinnerIndex, String[] spinnerItems) {
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
    private void callUBCGradesJsonArray(int currentSpinnerIndex, String apiEndpoint, ArrayAdapter<String>[] adapters) {
        UBCGradesRequest ubcGradesRequest = new UBCGradesRequest();
        UBCGradesRequest.ApiRequestListener apiRequestListener = new UBCGradesRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                updateSpinnerWithData(response.getAsJsonArray(), currentSpinnerIndex + 1, adapters);
            }

            @Override
            public void onApiRequestError(String error) {
                Log.d(UBCGradesRequest.RequestTag, "Failure");
                Log.d(UBCGradesRequest.RequestTag, error);
            }
        };
        ubcGradesRequest.makeUBCGradesGetRequest(apiEndpoint, apiRequestListener);
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void callUBCGradesJsonObject(String apiEndpoint, int searchbar) {
        UBCGradesRequest ubcGradesRequest = new UBCGradesRequest();
        UBCGradesRequest.ApiRequestListener apiRequestListener = new UBCGradesRequest.ApiRequestListener() {
            @Override
            public void onApiRequestComplete(JsonElement response) {
                Log.d(UBCGradesRequest.RequestTag, "Course grade request success");
                Deserializer deserializer = new Deserializer();
                if (searchbar == 1) course1GradesModel = deserializer.courseGradesModelDeserialize(response.getAsJsonObject());
                else if (searchbar == 2) course2GradesModel = deserializer.courseGradesModelDeserialize(response.getAsJsonObject());
            }
            @Override
            public void onApiRequestError(String error) {
                Log.d(UBCGradesRequest.RequestTag, "Failure");
                Log.d(UBCGradesRequest.RequestTag, error);
            }
        };
        ubcGradesRequest.makeUBCGradesGetRequest(apiEndpoint, apiRequestListener);
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void displaySearchResults(CourseGradesModel data, TextView[] textViews) {
        textViews[0].setText(String.format("%s %s%s %s %s %s",
                data.getCampus(), data.getYear(), data.getSession(),
                data.getSubject(), data.getCourse(), data.getSection()));
        textViews[1].setText(String.format("Average: %s", data.getAverage()));
        textViews[2].setText(String.format("Median: %s, High: %s, Low: %s",
                data.getMedian(), data.getHigh(), data.getLow()));
        textViews[3].setText(String.format("Teaching Team: %s",
                data.getEducators()));
        textViews[4].setText(String.format("Number of students enrolled: %s",
                data.getReported()));
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void updateSpinnerWithData(JsonArray responseData, int spinnerIndex, ArrayAdapter<String>[] adapters) {
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
    private void displayGraph() throws JSONException {
        Map<String, Integer> course1Data = course1GradesModel.getGrades();
        Map<String, Integer> course2Data = course2GradesModel.getGrades();

        ArrayList<String> xAxisLabels = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : course1Data.entrySet()) xAxisLabels.add(entry.getKey());
        xAxisLabels.add(0, xAxisLabels.remove(xAxisLabels.size()-1));

        BarDataSet dataSet1 = populateDatasets(course1Data);
        BarDataSet dataSet2 = populateDatasets(course2Data);
        dataSet1.setColor(Color.BLUE);
        dataSet2.setColor(Color.GRAY);
        BarData barData = new BarData(dataSet1, dataSet2);
        barChart.setData(barData);
        float groupSpace = 0.22f;
        float barSpace = 0.04f;
        float barWidth = 0.3f;
        barData.setBarWidth(barWidth);
        barChart.groupBars(0.01f, groupSpace, barSpace);

        Legend legend = barChart.getLegend();
        initializeLegend(legend);


        barChart.getDescription().setEnabled(false);
        YAxis rightYAxis = barChart.getAxisRight();
        rightYAxis.setEnabled(false);

        YAxis yAxis = barChart.getAxisLeft();
        yAxis.setDrawGridLines(false);

        XAxis xAxis = barChart.getXAxis();
        xAxis.setDrawGridLines(false);
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextSize(8f);
        xAxis.setValueFormatter(new IndexAxisValueFormatter(xAxisLabels));
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
    private void initializeLegend(Legend legend) {
        legend.setForm(Legend.LegendForm.SQUARE);
        legend.setFormSize(12f);
        legend.setTextColor(Color.BLACK);
        ArrayList<LegendEntry> legendEntries = new ArrayList<>();
        String course1Label = String.format("%s %s%s %s %s %s",
                course1GradesModel.getCampus(), course1GradesModel.getYear(), course1GradesModel.getSession(),
                course1GradesModel.getSubject(), course1GradesModel.getCourse(), course1GradesModel.getSection());
        String course2Label = String.format("%s %s%s %s %s %s",
                course2GradesModel.getCampus(), course2GradesModel.getYear(), course2GradesModel.getSession(),
                course2GradesModel.getSubject(), course2GradesModel.getCourse(), course2GradesModel.getSection());
        LegendEntry entry1 = new LegendEntry(course1Label, Legend.LegendForm.SQUARE, 12f, 0f, null, Color.BLUE);
        LegendEntry entry2 = new LegendEntry(course2Label, Legend.LegendForm.SQUARE, 12f, 0f, null, Color.GRAY);
        legendEntries.add(entry1);
        legendEntries.add(entry2);
        legend.setCustom(legendEntries);
    }

    /**
     * ChatGPT Usage: Partial
     */
    private BarDataSet populateDatasets(Map<String, Integer> courseData) {
        ArrayList<BarEntry> entries = new ArrayList<>();
        int index = 1;
        int val = 0;
        for (Map.Entry<String, Integer> entry : courseData.entrySet()) {
            entries.add(new BarEntry(index, entry.getValue()));
            val = entry.getValue();
            index++;
        }
        entries.remove(entries.size()-1);
        entries.add(0, new BarEntry(0, val));

        BarDataSet dataSet = new BarDataSet(entries, "Values");
        dataSet.setValueTextSize(0f);
        for (BarEntry entry : dataSet.getValues()) {
            Log.d("BarDataSet", "X: " + entry.getX() + ", Y: " + entry.getY());
        }
        return dataSet;
    }

    /**
     * ChatGPT Usage: Partial
     */
    private void initializeCompareButton(Button button) {
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (course1GradesModel == null || course2GradesModel == null) {
                    Toast.makeText(CompareCoursesActivity.this, "Please fill both search bars", Toast.LENGTH_SHORT).show();
                } else {
                    displaySearchResults(course1GradesModel, firstCourseTextViews);
                    displaySearchResults(course2GradesModel, secondCourseTextViews);
                    try {
                        displayGraph();
                    } catch (JSONException e) {
                        throw new InternalError(e);
                    }
                }
            }
        });
    }
}