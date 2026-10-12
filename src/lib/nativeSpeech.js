import { Capacitor, registerPlugin } from "@capacitor/core";

export const isNativeAndroid = Capacitor.getPlatform() === "android";
export const NativeSpeech = registerPlugin("EspikSpeech");
