// src/types/react-native-vector-icons.d.ts
declare module 'react-native-vector-icons/FontAwesome5' {
  import { Component } from 'react';
  import { IconProps } from 'react-native-vector-icons/Icon';

  class FontAwesome5IconComponent extends Component<IconProps> {
    static loadFont(file?: string): Promise<void>;
  }

  const FontAwesome5Module: {
    default: typeof FontAwesome5IconComponent;
  };
  export default FontAwesome5Module.default;
}
