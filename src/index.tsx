import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-image-to-rgb' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const ImageToRgbModule = isTurboModuleEnabled
  ? require('./NativeImageToRgb').default
  : NativeModules.ImageToRgb;

const ImageToRgb = ImageToRgbModule
  ? ImageToRgbModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function convertToRGB(uriString: string): Promise<number[]> {
  return ImageToRgb.convertToRGB(uriString);
}
