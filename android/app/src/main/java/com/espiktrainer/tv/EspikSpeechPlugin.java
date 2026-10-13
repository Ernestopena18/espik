package com.espiktrainer.tv;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Locale;
import java.util.Set;
import org.json.JSONArray;

@CapacitorPlugin(name = "EspikSpeech")
public class EspikSpeechPlugin extends Plugin {
    private TextToSpeech tts;
    private boolean ready = false;
    private PluginCall pendingCall;
    private volatile String currentRequest;
    private String activeLanguageTag = "";
    private String activeVoiceName = "";

    @Override
    public void load() {
        tts = new TextToSpeech(getContext(), status -> {
            ready = status == TextToSpeech.SUCCESS;
            if (ready) {
                tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String utteranceId) {}
                    @Override public void onDone(String utteranceId) { finish(utteranceId); }
                    @Override public void onError(String utteranceId) { finish(utteranceId); }
                    @Override public void onError(String utteranceId, int errorCode) { finish(utteranceId); }
                    @Override public void onStop(String utteranceId, boolean interrupted) { finish(utteranceId); }
                    @Override public void onRangeStart(String utteranceId, int start, int end, int frame) {
                        if (!utteranceId.equals(currentRequest)) return;
                        JSObject data = new JSObject();
                        data.put("requestId", utteranceId);
                        data.put("charIndex", start);
                        notifyListeners("speechProgress", data);
                    }
                });
            }
            JSObject data = new JSObject();
            data.put("ready", ready);
            notifyListeners("voicesChanged", data);
            if (pendingCall != null) {
                PluginCall call = pendingCall;
                pendingCall = null;
                getActivity().runOnUiThread(() -> startSpeech(call));
            }
        });
    }

    private void finish(String requestId) {
        if (!requestId.equals(currentRequest)) return;
        currentRequest = null;
        JSObject data = new JSObject();
        data.put("requestId", requestId);
        notifyListeners("speechFinished", data);
    }

    @PluginMethod
    public void getVoices(PluginCall call) {
        JSONArray voices = new JSONArray();
        if (ready && tts != null) {
            Set<Voice> installed = tts.getVoices();
            if (installed != null) for (Voice voice : installed) {
                JSObject item = new JSObject();
                item.put("name", voice.getName());
                item.put("lang", voice.getLocale().toLanguageTag());
                voices.put(item);
            }
        }
        JSObject result = new JSObject();
        result.put("voices", voices);
        call.resolve(result);
    }

    @PluginMethod
    public void speak(PluginCall call) {
        if (!ready && tts != null) {
            if (pendingCall != null) pendingCall.reject("La voz todavía se está iniciando.");
            pendingCall = call;
            return;
        }
        getActivity().runOnUiThread(() -> startSpeech(call));
    }

    private void startSpeech(PluginCall call) {
        if (!ready || tts == null) { call.reject("El motor de voz no está disponible en esta TV."); return; }
        String text = call.getString("text", "");
        String langTag = call.getString("langTag", "es-ES");
        String requestId = call.getString("requestId", "");
        if (text.isEmpty() || requestId.isEmpty()) { call.reject("Falta la frase o su identificador."); return; }
        Locale locale = Locale.forLanguageTag(langTag);
        if (!langTag.equalsIgnoreCase(activeLanguageTag)) {
            int languageResult = tts.setLanguage(locale);
            if (languageResult == TextToSpeech.LANG_MISSING_DATA || languageResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                call.reject("Esta TV no tiene instalada una voz para " + langTag + ".");
                return;
            }
            activeLanguageTag = langTag;
            activeVoiceName = "";
        }
        Voice best = null;
        Set<Voice> installed = tts.getVoices();
        if (installed != null) for (Voice voice : installed) {
            if (voice.getLocale().toLanguageTag().equalsIgnoreCase(langTag) &&
                (best == null || (best.isNetworkConnectionRequired() && !voice.isNetworkConnectionRequired()))) best = voice;
        }
        if (best != null && !best.getName().equals(activeVoiceName) && tts.setVoice(best) != TextToSpeech.ERROR) {
            activeVoiceName = best.getName();
        }
        tts.setSpeechRate(call.getFloat("rate", 0.9f));
        tts.setPitch(call.getFloat("pitch", 1.0f));
        currentRequest = requestId;
        int result = tts.speak(text, TextToSpeech.QUEUE_FLUSH, new Bundle(), requestId);
        if (result == TextToSpeech.ERROR) { currentRequest = null; call.reject("No se pudo reproducir la frase."); }
        else call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (pendingCall != null) { pendingCall.reject("Lectura cancelada."); pendingCall = null; }
        currentRequest = null;
        if (tts != null) tts.stop();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); tts = null; }
        super.handleOnDestroy();
    }
}
