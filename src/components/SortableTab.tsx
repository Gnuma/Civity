import React from "react";
import { View, Text } from "react-native";
import { TAB_SIZE } from "../views/Sell/PhotosList";
import Animated, { Easing } from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { panGestureHandler } from "react-native-redash";

const {
  Value,
  add,
  eq,
  cond,
  block,
  set,
  useCode,
  multiply,
  floor,
  divide,
  max,
  and,
  Clock,
  startClock,
  spring,
  round
} = Animated;
export const withOffset = ({
  offset,
  value,
  state: gestureState
}: {
  offset: Animated.Adaptable<number>;
  value: Animated.Value<number>;
  state: Animated.Value<State>;
}) => {
  const safeOffset = new Value(0);
  return cond(
    eq(gestureState, State.ACTIVE),
    add(safeOffset, value),
    set(safeOffset, offset)
  );
};

export const withTransition = (
  value: Animated.Node<number>,
  velocity: Animated.Value<number>,
  gestureState: Animated.Value<State>
) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };
  const config = {
    toValue: new Value(0),
    damping: 30,
    mass: 1,
    stiffness: 200,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 1
  };
  return block([
    startClock(clock),
    set(config.toValue, value),
    cond(
      eq(gestureState, State.ACTIVE),
      [set(state.velocity, velocity), set(state.position, value)],
      spring(clock, state, config)
    ),
    state.position
  ]);
};

interface SortableTabProps {
  index: number;
  offsets: { x: Animated.Value<number>; y: Animated.Value<number> }[];
  children: React.ReactElement;
}

const SortableTab = ({ index, children, offsets }: SortableTabProps) => {
  const {
    gestureHandler,
    state,
    translationX,
    velocityX,
    translationY,
    velocityY
  } = panGestureHandler();
  const zIndex = cond(eq(state, State.ACTIVE), 10, 1);
  const currentOffset = offsets[index];
  const x = withOffset({
    value: translationX,
    offset: currentOffset.x,
    state
  });
  const y = withOffset({
    value: translationY,
    offset: currentOffset.y,
    state
  });
  const offsetX = multiply(round(divide(x, TAB_SIZE)), TAB_SIZE);
  const offsetY = multiply(round(divide(y, TAB_SIZE)), TAB_SIZE);
  const translateX = withTransition(x, velocityX, state);
  const translateY = withTransition(y, velocityY, state);

  useCode(
    block(
      offsets.map(offset =>
        cond(
          and(
            eq(offsetX, offset.x),
            eq(offsetY, offset.y),
            eq(state, State.ACTIVE)
          ),
          [
            set(offset.x, currentOffset.x),
            set(offset.y, currentOffset.y),
            set(currentOffset.x, offsetX),
            set(currentOffset.y, offsetY)
          ]
        )
      )
    ),
    []
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: TAB_SIZE,
          height: TAB_SIZE,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ translateX }, { translateY }],
          zIndex
        }}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SortableTab;
