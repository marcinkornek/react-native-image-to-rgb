package com.imagetorgb

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.graphics.BitmapFactory
import android.graphics.Color
import android.net.Uri
import com.facebook.react.bridge.Arguments
import java.net.URL

class ImageToRgbModule internal constructor(context: ReactApplicationContext) :
  ImageToRgbSpec(context) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun convertToRGB(uriString: String, promise: Promise) {
      val uri = Uri.parse(uriString)
      val context = reactApplicationContext

      try {
          // Check if the URI is remote
          val inputStream = if (uri.scheme == "http" || uri.scheme == "https") {
              // Remote URI, download the image
              val url = URL(uriString)
              url.openStream()
          } else {
              // Local URI, get the input stream from the content resolver
              context.contentResolver.openInputStream(uri)
          }

          inputStream?.use { stream ->
              val bitmap = BitmapFactory.decodeStream(stream)
              val width = bitmap.width
              val height = bitmap.height
              val rgbArray = IntArray(width * height)
              bitmap.getPixels(rgbArray, 0, width, 0, 0, width, height)

              // Flattened RGB array
              val flatRgbArray = Arguments.createArray()
              rgbArray.forEach { pixel ->
                  flatRgbArray.pushInt(Color.red(pixel))
                  flatRgbArray.pushInt(Color.green(pixel))
                  flatRgbArray.pushInt(Color.blue(pixel))
              }

              promise.resolve(flatRgbArray)
          } ?: throw Exception("Unable to open input stream for URI: $uriString")
      } catch (e: Exception) {
          promise.reject("Error", "Failed to convert URI to RGB array", e)
      }
  }

  companion object {
    const val NAME = "ImageToRgb"
  }
}
