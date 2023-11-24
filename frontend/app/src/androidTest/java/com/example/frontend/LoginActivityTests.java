package com.example.frontend;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.action.ViewActions;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.Rule;
import org.junit.Test;

public class LoginActivityTests {
    /* ChatGPT usage: Yes */
    @Rule
    public ActivityScenarioRule<LoginActivity> activityRule =
            new ActivityScenarioRule<>(LoginActivity.class);

    /* ChatGPT usage: Partial */
    @Test
    public void click_login_button() {
        Espresso.onView(ViewMatchers.withId(R.id.login_button)).perform(ViewActions.click());

        ActivityScenario<SignupActivity> secondActivityScenario =
                ActivityScenario.launch(SignupActivity.class);

        Espresso.onView(ViewMatchers.withId(R.id.name_input))
                .check(ViewAssertions.matches(ViewMatchers.isDisplayed()));

        Espresso.onView(ViewMatchers.withId(R.id.major_spinner))
                .check(ViewAssertions.matches(ViewMatchers.isDisplayed()));

        Espresso.onView(ViewMatchers.withId(R.id.year_level_input))
                .check(ViewAssertions.matches(ViewMatchers.isDisplayed()));
    }
}
