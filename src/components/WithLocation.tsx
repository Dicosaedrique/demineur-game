import React from "react";
import { useLocation } from "react-router-dom";

export default (Component: React.ElementType) => (props: any): JSX.Element => (
    <Component {...props} location={useLocation()} />
);
