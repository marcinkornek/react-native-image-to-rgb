import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  convertToRGB(uri: string): Promise<number[]>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ImageToRgb');
