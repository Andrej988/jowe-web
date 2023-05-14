import React from 'react';
import { CCol, CWidgetStatsA } from '@coreui/react';
import { getStyle } from '@coreui/utils';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom, cilArrowTop } from '@coreui/icons';
import { toFormattedDateString } from '../../services/utils/DateUtils';
import type { SimpleMeasurement, SimpleMeasurements } from 'src/model/weight/Measurements';

interface Props {
  title: string;
  color: string;
  unit?: string;
  pointStyle: string;
  measurements: SimpleMeasurements;
}

const calculateDiffPercentage = (
  latestMeasurement: SimpleMeasurement,
  secondToLastMeasurement: SimpleMeasurement,
): number => {
  if (latestMeasurement === undefined || secondToLastMeasurement === undefined) {
    return 0;
  }

  return (
    Math.round(
      ((1 - latestMeasurement.measurement / secondToLastMeasurement.measurement) * -100 +
        Number.EPSILON) *
        100,
    ) / 100
  );
};

const WeightMeasurementWidget: React.FC<Props> = (props) => {
  const measurementsSortedByDate = props.measurements.slice();
  const latestMeasurement = measurementsSortedByDate[measurementsSortedByDate.length - 1];
  const secondToLastMeasurement = measurementsSortedByDate[measurementsSortedByDate.length - 2];
  const diffPercentage = calculateDiffPercentage(latestMeasurement, secondToLastMeasurement);

  return (
    <CCol sm={6} lg={3}>
      <CWidgetStatsA
        className="mb-4"
        color={props.color}
        value={
          <>
            {latestMeasurement !== undefined
              ? `${latestMeasurement.measurement} ${props.unit !== undefined ? props.unit : ''}`
              : '-'}{' '}
            <span className="fs-6 fw-normal">
              ({diffPercentage}% <CIcon icon={diffPercentage < 0 ? cilArrowBottom : cilArrowTop} />)
            </span>
          </>
        }
        title={props.title}
        chart={
          <CChartLine
            className="mt-3"
            style={{ height: '70px' }}
            data={{
              labels: measurementsSortedByDate.map((x) => toFormattedDateString(x.date)),
              datasets: [
                {
                  label: props.title,
                  backgroundColor: 'rgba(255,255,255,.2)',
                  borderColor: 'rgba(255,255,255,.55)',
                  pointBackgroundColor: getStyle(props.pointStyle),
                  data: measurementsSortedByDate.map((x) => x.measurement),
                  fill: true,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              maintainAspectRatio: false,
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                },
              },
              elements: {
                line: {
                  borderWidth: 2,
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }}
          />
        }
      />
    </CCol>
  );
};

export default WeightMeasurementWidget;
