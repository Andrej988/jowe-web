import React from 'react'
import { CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import MeasurementWidget from './MeasurementWidget.js'

const MeasurementWidgets = (props) => {
  const measurementsSortedByDate = props.measurements.slice().reverse()

  return (
    <CRow>
      <MeasurementWidget
        color="info"
        title="Weight"
        unit="kg"
        pointStyle="--cui-info"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return { date: x.date, measurement: x.measurements.weight }
        })}
      />
      <MeasurementWidget
        color="warning"
        title="Body Fat"
        unit="%"
        pointStyle="--cui-warning"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return { date: x.date, measurement: x.measurements.bodyFatPercentage }
        })}
      />
      <MeasurementWidget
        color="success"
        title="Muscle Mass"
        unit="%"
        pointStyle="--cui-success"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return { date: x.date, measurement: x.measurements.muscleMassPercentage }
        })}
      />
      <MeasurementWidget
        color="danger"
        title="Energy Expenditure"
        unit="kcal"
        pointStyle="--cui-danger"
        measurements={measurementsSortedByDate.slice().map((x) => {
          return { date: x.date, measurement: x.measurements.energyExpenditure }
        })}
      />
    </CRow>
  )
}

MeasurementWidgets.defaultProps = {
  measurements: {},
}

MeasurementWidgets.propTypes = {
  measurements: PropTypes.any,
}

export default MeasurementWidgets
