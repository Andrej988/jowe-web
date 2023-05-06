import { createSlice } from '@reduxjs/toolkit';
import { type Measurement } from '../model/weight/Measurement';

const initialState = {
  measurements: [],
  isFetched: false,
};

const addMeasurement = (state: any, measurement: Measurement): void => {
  const newMeasurements = [...state.measurements];
  newMeasurements.push(measurement);
  state.measurements = newMeasurements;
};

const weightSlice = createSlice({
  name: 'weight',
  initialState,
  reducers: {
    setMeasurements(state, action) {
      state.measurements = action.payload;
      state.isFetched = true;
    },
    addMeasurement(state, action) {
      addMeasurement(state, action.payload);
    },
  },
});

export const actions = weightSlice.actions;
export default weightSlice.reducer;
