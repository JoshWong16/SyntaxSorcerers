package com.example.frontend;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import static com.example.frontend.ToastMatcher.checkToastMessage;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.Rule;
import org.junit.Test;

public class SignUpActivityTests {
    /* ChatGPT usage: Yes */
    @Rule
    public ActivityScenarioRule<SignupActivity> activityRule =
            new ActivityScenarioRule<>(SignupActivity.class);

    /* ChatGPT usage: Partial */
    @Test
    public void happy_path() {
        onView(withId(R.id.name_input))
                .perform(typeText("John Doe"), closeSoftKeyboard());

        onView(withId(R.id.major_spinner)).perform(click());
        onView(withText("Anthropology"))
                .perform(click());

        onView(withId(R.id.year_level_input))
                .perform(typeText("4"), closeSoftKeyboard());

        onView(withId(R.id.submit_button)).perform(click());

        ActivityScenario.launch(HomeActivity.class);

        onView(withId(R.id.SearchCoursesButton))
                .check(ViewAssertions.matches(ViewMatchers.isDisplayed()));
    }

    /* ChatGPT usage: Partial */
    @Test
    public void invalid_name() {
        onView(withId(R.id.major_spinner)).perform(click());
        onView(withText("Anthropology"))
                .perform(click());

        onView(withId(R.id.year_level_input))
                .perform(typeText("4"), closeSoftKeyboard());

        String toastText = "Please enter a valid name";
        onView(withId(R.id.submit_button)).perform(click());
        checkToastMessage(toastText);
    }

    /* ChatGPT usage: Partial */
    @Test
    public void invalid_major() {
        onView(withId(R.id.name_input))
                .perform(typeText("John Doe"), closeSoftKeyboard());

        onView(withId(R.id.year_level_input))
                .perform(typeText("4"), closeSoftKeyboard());

        String toastText = "Please select a major";
        onView(withId(R.id.submit_button)).perform(click());
        checkToastMessage(toastText);
    }

    /* ChatGPT usage: Partial */
    @Test
    public void invalid_year() {
        onView(withId(R.id.name_input))
                .perform(typeText("John Doe"), closeSoftKeyboard());

        onView(withId(R.id.major_spinner)).perform(click());
        onView(withText("Anthropology"))
                .perform(click());

        onView(withId(R.id.year_level_input))
                .perform(typeText("word"), closeSoftKeyboard());

        String toastText = "Please enter a valid year level";
        onView(withId(R.id.submit_button)).perform(click());
        checkToastMessage(toastText);
    }
}
