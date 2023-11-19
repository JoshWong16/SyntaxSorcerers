package com.example.frontend;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.action.ViewActions;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.Rule;
import org.junit.Test;

public class CompareCoursesActivityTests {
    @Rule
    public ActivityScenarioRule<CompareCoursesActivity> activityRule =
            new ActivityScenarioRule<>(CompareCoursesActivity.class);

    @Test
    public void clickButton_startsCompareCoursesActivity() {
        Espresso.onView(ViewMatchers.withId(R.id.CompareCoursesButton)).perform(ViewActions.click());

        ActivityScenario<CompareCoursesActivity> secondActivityScenario =
                ActivityScenario.launch(CompareCoursesActivity.class);

        Espresso.onView(ViewMatchers.withId(R.id.yearSession1))
                .check(ViewAssertions.matches(ViewMatchers.isDisplayed()));
    }
}
