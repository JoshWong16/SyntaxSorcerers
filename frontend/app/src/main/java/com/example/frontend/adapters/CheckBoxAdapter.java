package com.example.frontend.adapters;


import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;

import java.util.List;

/* ChatGPT generated code to added checkboxes to a listView for the course recommender use case */
public class CheckBoxAdapter extends BaseAdapter {
    private List<CheckBox> checkBoxList;
    private Context context;

    public CheckBoxAdapter(Context context, List<CheckBox> checkBoxList) {
        this.context = context;
        this.checkBoxList = checkBoxList;
    }

    @Override
    public int getCount() {
        return checkBoxList.size();
    }

    @Override
    public Object getItem(int position) {
        return checkBoxList.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        CheckBox checkBox = checkBoxList.get(position);
        return checkBox;
    }
}
