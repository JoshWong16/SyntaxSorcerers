package com.example.frontend;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.CoreMatchers.containsString;
import static com.example.frontend.ToastMatcher.checkToastMessage;

import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.Rule;
import org.junit.Test;

public class CompareCoursesActivityTests {
    int SLEEP_TIME = 2000;

    /* ChatGPT usage: Yes */
    @Rule
    public ActivityScenarioRule<CompareCoursesActivity> activityRule =
            new ActivityScenarioRule<>(CompareCoursesActivity.class);

    /* ChatGPT usage: Partial */
    @Test
    public void firstSearchBar() throws InterruptedException {
        onView(ViewMatchers.withId(R.id.yearSession1)).perform(click());
        onView(withText("2022W"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.subject1)).perform(click());
        onView(withText("APSC"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.course1)).perform(click());
        onView(withText("100"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.section1)).perform(click());
        onView(withText("101"))
                .perform(click());
    }

    /* ChatGPT usage: Partial */
    @Test
    public void secondSearchBar() throws InterruptedException {
        onView(ViewMatchers.withId(R.id.yearSession2)).perform(click());
        onView(withText("2022W"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.subject2)).perform(click());
        onView(withText("APSC"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.course2)).perform(click());
        onView(withText("101"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.section2)).perform(click());
        onView(withText("201"))
                .perform(click());
    }

    /* ChatGPT usage: Partial */
    @Test
    public void compareButton() throws InterruptedException {
        onView(ViewMatchers.withId(R.id.yearSession1)).perform(click());
        onView(withText("2022W"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.subject1)).perform(click());
        onView(withText("APSC"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.course1)).perform(click());
        onView(withText("100"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.section1)).perform(click());
        onView(withText("101"))
                .perform(click());

        onView(ViewMatchers.withId(R.id.yearSession2)).perform(click());
        onView(withText("2022W"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.subject2)).perform(click());
        onView(withText("APSC"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.course2)).perform(click());
        onView(withText("101"))
                .perform(click());
        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.section2)).perform(click());
        onView(withText("201"))
                .perform(click());

        onView(ViewMatchers.withId(R.id.compareButton)).perform(click());

        Thread.sleep(SLEEP_TIME);
        onView(ViewMatchers.withId(R.id.courseName1))
                .check(matches(withText(containsString("UBCV 2022W APSC 100 101"))));
        onView(ViewMatchers.withId(R.id.average1))
                .check(matches(withText(containsString("Average: 75.1"))));
        onView(ViewMatchers.withId(R.id.stats1))
                .check(matches(withText(containsString("Median: 78.0, High: 97, Low: 22"))));
        onView(ViewMatchers.withId(R.id.teachers1))
                .check(matches(withText(containsString("Teaching Team: Peter Ostafichuk;Brian Dick;Jonathan Nakane;Carol Patricia Jaeger;Chris McLean;Seyyed Alireza Bagherzadeh Hosseini"))));
        onView(ViewMatchers.withId(R.id.enrolled1))
                .check(matches(withText(containsString("Number of students enrolled: 251"))));

        onView(ViewMatchers.withId(R.id.courseName2))
                .check(matches(withText(containsString("UBCV 2022W APSC 101 201"))));
        onView(ViewMatchers.withId(R.id.average2))
                .check(matches(withText(containsString("Average: 73.2"))));
        onView(ViewMatchers.withId(R.id.stats2))
                .check(matches(withText(containsString("Median: 74.0, High: 97, Low: 0"))));
        onView(ViewMatchers.withId(R.id.teachers2))
                .check(matches(withText(containsString("Teaching Team: Peter Ostafichuk;Amir Mehdi Dehkhoda;Jonathan Nakane;Carol Patricia Jaeger;Chris McLean;Roza Vaez Ghaemi"))));
        onView(ViewMatchers.withId(R.id.enrolled2))
                .check(matches(withText(containsString("Number of students enrolled: 250"))));
    }

    /* ChatGPT usage: Partial */
    @Test
    public void compareButton_fail() {
        String toastText = "Please fill in both search bars";
        onView(ViewMatchers.withId(R.id.compareButton)).perform(click());
        checkToastMessage(toastText);
    }
}
