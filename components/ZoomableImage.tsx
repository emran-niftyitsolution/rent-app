import { useEffect } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export type ImageControlRef = {
  zoomIn: () => void;
  zoomOut: () => void;
  rotate: () => void;
  rotateCounterClockwise: () => void;
  reset: () => void;
};

interface ZoomableImageProps {
  uri: string;
  resetTrigger: number;
  controlRef?: React.MutableRefObject<ImageControlRef | null>;
}

export function ZoomableImage({
  uri,
  resetTrigger,
  controlRef,
}: ZoomableImageProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  useEffect(() => {
    // Reset when resetTrigger changes
    scale.value = withSpring(1);
    savedScale.value = 1;
    rotation.value = withSpring(0);
    savedRotation.value = 0;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  const resetTransform = () => {
    "worklet";
    scale.value = withSpring(1);
    savedScale.value = 1;
    rotation.value = withSpring(0);
    savedRotation.value = 0;
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const zoomIn = () => {
    const newScale = Math.min(savedScale.value * 1.5, 5);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
  };

  const zoomOut = () => {
    const newScale = Math.max(savedScale.value / 1.5, 1);
    scale.value = withSpring(newScale);
    savedScale.value = newScale;
    if (newScale === 1) {
      resetTransform();
    }
  };

  const rotate = () => {
    "worklet";
    const newRotation = savedRotation.value + Math.PI / 2;
    savedRotation.value = newRotation;
    rotation.value = withSpring(newRotation);
  };

  const rotateCounterClockwise = () => {
    "worklet";
    const newRotation = savedRotation.value - Math.PI / 2;
    savedRotation.value = newRotation;
    rotation.value = withSpring(newRotation);
  };

  // Expose control functions via ref
  useEffect(() => {
    if (controlRef) {
      controlRef.current = {
        zoomIn,
        zoomOut,
        rotate,
        rotateCounterClockwise,
        reset: resetTransform,
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlRef, resetTrigger]);

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      if (scale.value > 1) {
        resetTransform();
      } else {
        const newScale = 2.5;
        scale.value = withSpring(newScale);
        savedScale.value = newScale;
        translateX.value = withSpring(
          (SCREEN_WIDTH / 2 - event.x) * (newScale - 1)
        );
        translateY.value = withSpring(
          (SCREEN_HEIGHT / 2 - event.y) * (newScale - 1)
        );
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      focalX.value = SCREEN_WIDTH / 2;
      focalY.value = SCREEN_HEIGHT / 2;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.max(1, Math.min(newScale, 5));

      // Adjust translation based on focal point
      const scaleChange = scale.value - savedScale.value;
      translateX.value =
        savedTranslateX.value -
        (focalX.value - SCREEN_WIDTH / 2) * (scaleChange / savedScale.value);
      translateY.value =
        savedTranslateY.value -
        (focalY.value - SCREEN_HEIGHT / 2) * (scaleChange / savedScale.value);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      if (scale.value < 1) {
        resetTransform();
      } else if (scale.value > 5) {
        scale.value = withSpring(5);
        savedScale.value = 5;
      }
    });

  const rotationGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .minPointers(1)
    .maxPointers(1)
    .onUpdate((event) => {
      "worklet";
      // Only pan if image is zoomed or rotated
      // When in initial state, don't interfere with horizontal scrolling
      if (scale.value > 1 || Math.abs(rotation.value) > 0.01) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      "worklet";
      if (scale.value > 1 || Math.abs(rotation.value) > 0.01) {
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    })
    // Make horizontal swipes fail easily when in initial state to allow ScrollView scrolling
    .failOffsetX([-5, 5]);

  const composedGesture = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(
      Gesture.Simultaneous(pinchGesture, rotationGesture),
      panGesture
    )
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${(rotation.value * 180) / Math.PI}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={{
          width: SCREEN_WIDTH,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.Image
          source={{ uri }}
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT,
            },
            animatedStyle,
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

