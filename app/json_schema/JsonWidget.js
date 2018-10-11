import React from 'react';
import ReactJson from 'react-json-view';

import PropTypes from "prop-types";

const JsonWidget = (props) => {
  console.log(props.value)
  return (
    <ReactJson src={props.value!=undefined?JSON.parse(props.value):props.value} />
  );
};


export default JsonWidget 