#import "ImageToRgb.h"

@implementation ImageToRgb
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(convertToRGB:(NSString *)imageUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Check if the URI is local or remote
    NSLog(@"LOGconvertToRGB imageUri: %@", imageUri);
    UIImage *image;
    if ([imageUri hasPrefix:@"http"] || [imageUri hasPrefix:@"https"]) {
        // The URI is remote, download the image
        NSURL *imageUrl = [NSURL URLWithString:imageUri];
        NSData *imageData = [NSData dataWithContentsOfURL:imageUrl];
        image = [UIImage imageWithData:imageData];
    } else {
        // The URI is local, load the image directly
        image = [UIImage imageNamed:imageUri];
    }

    if (!image) {
        reject(@"image_not_found", @"Could not find the image.", nil);
        return;
    }

    // Create an RGB color space
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();

    // Set up the bitmap context for drawing
    NSUInteger width = CGImageGetWidth(image.CGImage);
    NSUInteger height = CGImageGetHeight(image.CGImage);
    unsigned char *rawData = (unsigned char*) calloc(height * width * 4, sizeof(unsigned char));
    NSUInteger bytesPerPixel = 4;
    NSUInteger bytesPerRow = bytesPerPixel * width;
    NSUInteger bitsPerComponent = 8;
    CGContextRef context = CGBitmapContextCreate(rawData, width, height,
                                                bitsPerComponent, bytesPerRow, colorSpace,
                                                kCGImageAlphaPremultipliedLast | kCGBitmapByteOrder32Big);

    // Draw the image onto the context
    CGContextDrawImage(context, CGRectMake(0, 0, width, height), image.CGImage);
    NSMutableArray *rgbArray = [NSMutableArray arrayWithCapacity:width * height];

    // Iterate over the pixels to extract RGB values
    for (NSUInteger y = 0; y < height; y++) {
        for (NSUInteger x = 0; x < width; x++) {
            NSUInteger byteIndex = (bytesPerRow * y) + x * bytesPerPixel;
            CGFloat red   = (CGFloat)rawData[byteIndex];
            CGFloat green = (CGFloat)rawData[byteIndex + 1];
            CGFloat blue  = (CGFloat)rawData[byteIndex + 2];
            [rgbArray addObject:@(red)];
            [rgbArray addObject:@(green)];
            [rgbArray addObject:@(blue)];
        }
    }

    // Cleanup
    CGContextRelease(context);
    CGColorSpaceRelease(colorSpace);
    free(rawData);

    // Return the RGB array to React Native
    resolve(rgbArray);
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeImageToRgbSpecJSI>(params);
}
#endif

@end
