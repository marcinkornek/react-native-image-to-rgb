# react-native-image-to-rgb

library for converting images to rgb array buffers. This may be useful eg. if you want to detect what's on the image using https://github.com/mrousavy/react-native-fast-tflite. Library accepts both local and remote URIs.

## Installation

```sh
npm install react-native-image-to-rgb
```

## Usage

```js
import { convertToRGB } from 'react-native-image-to-rgb';

// ...

const result = await convertToRGB(imageUri);
// result = [255, 254, 0, .....]
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
