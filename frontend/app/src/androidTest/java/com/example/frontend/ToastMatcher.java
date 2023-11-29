package com.example.frontend;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import android.os.IBinder;
import android.view.View;
import android.view.WindowManager;

import androidx.test.espresso.Root;
import androidx.test.espresso.assertion.ViewAssertions;
import androidx.test.espresso.matcher.RootMatchers;

import org.hamcrest.Description;
import org.hamcrest.TypeSafeMatcher;

public class ToastMatcher extends TypeSafeMatcher<Root> {

    /* ChatGPT usage: Yes */
    @Override
    public void describeTo(Description description) {
        description.appendText("is toast");
    }

    /* ChatGPT usage: Yes */
    @Override
    public boolean matchesSafely(Root root) {
        int type = root.getWindowLayoutParams().get().type;
        if (type == WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY) {
            View windowDecorView = root.getDecorView();
            IBinder windowToken = windowDecorView.getWindowToken();
            IBinder appToken = windowDecorView.getApplicationWindowToken();
            return windowToken == appToken;
        }
        return false;
    }

    /* ChatGPT usage: Yes */
    public static void checkToastMessage(String message) {
        onView(withText(message))
                .inRoot(RootMatchers.withDecorView(isDisplayed()))
                .check(ViewAssertions.matches(isDisplayed()));
    }
}