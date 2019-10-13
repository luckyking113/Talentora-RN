package com.talentora;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.shahenlibrary.RNVideoProcessingPackage;
import cl.json.RNSharePackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.rnfs.RNFSPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeYouTube(),
            new RNVideoProcessingPackage(),
            new RNSharePackage(),
            new ReactNativePushNotificationPackage(),
            new PickerPackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNFSPackage(),
            new ReactVideoPackage(),
            new ReactNativeOneSignalPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new RNDeviceInfo(),
            new FBSDKPackage(),
            new VectorIconsPackage(),
            new RCTCameraPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
