package com.example.frontend.adapters;


import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;

import java.util.List;

/* ChatGPT usage: Yes */
/* ChatGPT generated code to added checkboxes to a listView for the course recommender use case */
public class CheckBoxAdapter extends BaseAdapter {
    private List<CheckBox> checkBoxList;

    /* ChatGPT usage: Yes */
    public CheckBoxAdapter(List<CheckBox> checkBoxList) {
        this.checkBoxList = checkBoxList;
    }

    /* ChatGPT usage: Yes */
    @Override
    public int getCount() {
        return checkBoxList.size();
    }

    /* ChatGPT usage: Yes */
    @Override
    public Object getItem(int position) {
        return checkBoxList.get(position);
    }

    /* ChatGPT usage: Yes */
    @Override
    public long getItemId(int position) {
        return position;
    }

    /* ChatGPT usage: Yes */
    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        CheckBox checkBox = checkBoxList.get(position);
        return checkBox;
    }
}
