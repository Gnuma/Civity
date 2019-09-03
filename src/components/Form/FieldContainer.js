import React, { Fragment } from "react";
import { Text, View } from "react-native";
import ErrorMessage from "./ErrorMessage";

export default ({ error, children }) => {
  return (
    <Fragment>
      {children}
      {!!error && <ErrorMessage message={error} />}
    </Fragment>
  );
};
