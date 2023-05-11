import { createSlice } from '@reduxjs/toolkit';
import { type Measurement } from '../model/weight/Measurements';
import { type TargetWeight } from 'src/model/weight/TargetWeights';

const initialState = {
  measurements: [],
  isFetchedMeasurements: false,
  targetWeights: [],
  isFetchedTargetWeights: false,
};

const addMeasurement = (state: any, measurement: Measurement): void => {
  const newMeasurements = [...state.measurements];
  newMeasurements.push(measurement);
  state.measurements = newMeasurements;
};

const removeMeasurement = (state: any, measurementId: string): void => {
  const newMeasurements = [...state.measurements];
  state.measurements = newMeasurements.filter((x) => x.measurementId !== measurementId);
};

const addTargetWeight = (state: any, targetWeight: TargetWeight): void => {
  const newTargetWeights = [...state.targetWeights];
  newTargetWeights.push(targetWeight);
  state.targetWeights = newTargetWeights;
};

const removeTargetWeight = (state: any, recordId: string): void => {
  const newTargetWeights = [...state.targetWeights];
  state.targetWeights = newTargetWeights.filter((x) => x.recordId !== recordId);
};

const weightSlice = createSlice({
  name: 'weight',
  initialState,
  reducers: {
    setMeasurements(state, action) {
      state.measurements = action.payload;
      state.isFetchedMeasurements = true;
    },
    addMeasurement(state, action) {
      addMeasurement(state, action.payload);
    },
    removeMeasurement(state, action) {
      removeMeasurement(state, action.payload);
    },
    setTargetWeights(state, action) {
      state.targetWeights = action.payload;
      state.isFetchedTargetWeights = true;
    },
    addTargetWeight(state, action) {
      addTargetWeight(state, action.payload);
    },
    removeTargetWeight(state, action) {
      removeTargetWeight(state, action.payload);
    },
    resetState(state) {
      state.measurements = [];
      state.isFetchedMeasurements = false;
      state.targetWeights = [];
      state.isFetchedTargetWeights = false;
    },
  },
});

export const actions = weightSlice.actions;
export default weightSlice.reducer;
