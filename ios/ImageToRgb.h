
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNImageToRgbSpec.h"

@interface ImageToRgb : NSObject <NativeImageToRgbSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ImageToRgb : NSObject <RCTBridgeModule>
#endif

@end
