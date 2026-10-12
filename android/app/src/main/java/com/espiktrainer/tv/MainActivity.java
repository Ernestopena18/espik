package com.espiktrainer.tv;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(EspikSpeechPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
