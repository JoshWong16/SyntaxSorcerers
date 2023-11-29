package com.example.frontend;


import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withText;


import androidx.test.espresso.Espresso;
import androidx.test.espresso.action.ViewActions;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;


import org.hamcrest.Matchers;
import org.junit.Rule;
import org.junit.Test;

public class CreatePostTests {


    @Rule
    public ActivityScenarioRule<ForumActivity> activityRule =
            new ActivityScenarioRule<>(ForumActivity.class);


    /* ChatGPT usage: Partial */
    @Test
    public void clickCPEN321Forum() {

        Espresso.onView(ViewMatchers.withId(R.id.forum_layout_joined))
                .check(ViewAssertions.matches(isDisplayed()));

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.forum_name), withText("CPEN 321 Forum")))
                .check(ViewAssertions.matches(isDisplayed()))
                .perform(click());

    }

    /* ChatGPT usage: Partial */
    @Test
    public void checkPostForCPEN321Forum() {

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.forum_name), withText("CPEN 321 Forum")))
                .check(ViewAssertions.matches(isDisplayed()))
                .perform(click());

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.post_user), withText("Billy Bob")))
                .check(ViewAssertions.matches(isDisplayed()));

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.post_content), withText("The professor is awesome for this class")))
                .check(ViewAssertions.matches(isDisplayed()));
    }

    /* ChatGPT usage: Partial */
    @Test
    public void checkTextFieldAndSubmitButton() {

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.forum_name), withText("CPEN 321 Forum")))
                .check(ViewAssertions.matches(isDisplayed()))
                .perform(click());

        Espresso.onView(ViewMatchers.withId(R.id.postMessage))
                .check(ViewAssertions.matches(isDisplayed()));

        Espresso.onView(ViewMatchers.withId(R.id.create_forum_button))
                .check(ViewAssertions.matches(isDisplayed()));

    }

    /* ChatGPT usage: Yes */
    @Test
    public void emptyTextFieldForPost() {

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.forum_name), withText("CPEN 321 Forum")))
                .check(ViewAssertions.matches(isDisplayed()))
                .perform(click());

        Espresso.onView(ViewMatchers.withId(R.id.postMessage))
                .perform(ViewActions.clearText())
                .perform(ViewActions.typeText(""))
                .check(ViewAssertions.matches(withText("")))
                .check(ViewAssertions.matches(isDisplayed()));

    }

    /* ChatGPT usage: Yes */
    @Test
    public void nonEmptyTextFieldForPostAndDisplayPost() throws InterruptedException {

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.forum_name), withText("CPEN 321 Forum")))
                .check(ViewAssertions.matches(isDisplayed()))
                .perform(click());

        Espresso.onView(ViewMatchers.withId(R.id.postMessage))
                .perform(ViewActions.clearText())
                .perform(ViewActions.typeText("This course is superb"))
                .check(ViewAssertions.matches(withText("This course is superb")))
                .check(ViewAssertions.matches(isDisplayed()));

        Espresso.onView(ViewMatchers.withId(R.id.create_forum_button))
                .perform(click());

        Thread.sleep(1000);

        Espresso.onView(Matchers.allOf(ViewMatchers.withId(R.id.post_content), withText("This course is superb")))
                .check(ViewAssertions.matches(isDisplayed()));

    }
}
