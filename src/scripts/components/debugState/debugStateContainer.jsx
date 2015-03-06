import React from 'react';
import moment from 'moment';
import R from 'ramda';

import { AppState } from '../../stores/index';

import DebugState from './debugState.jsx';

class DebugStateContainer extends React.Component {

  constructor(props){
    super(props);
    let debugObject = this.createDebugObject();
    this.state = debugObject;
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AppState.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.onChange);
  }

  onChange(){
    let debugObject = this.createDebugObject();
    return this.setState(debugObject);
  }

  getTime(timestamp){
    return moment(timestamp).startOf('minutes').fromNow();
  }

  createDebugObject(){
    let state = AppState.current;
    let { timestamp } = state;
    state.timestamp = this.getTime(timestamp);
    return this.divideDebugObject(state);
  }

  divideDebugObject(object){
    let dataArray = R.toPairs(object);
    let createTitleData = (result, [ key, value ]) => {
      if(R.is(Object, value)){
        result[key] = value;
      } else {
        result['general'] = result['general'] || {};
        result['general'][key] = value;
      }
      return result;
    };
    return R.reduce(createTitleData,  {}, dataArray);
  }

  render(){
    return (
      <DebugState object={this.state}></DebugState>
    )
  }
};

export default DebugStateContainer;
