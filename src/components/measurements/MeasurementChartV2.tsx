import React, { Fragment, useEffect, useState } from 'react';
//import 'chartjs-adapter-moment';
import 'chartjs-adapter-date-fns';
import { enGB } from 'date-fns/locale';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  registerables,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';

//import ‘chartjs-adapter-date-fns’;

import { CButton, CButtonGroup, CCard, CCardBody, CCol, CRow } from '@coreui/react';
import { SimpleMeasurements } from 'src/model/Measurement';
import {
  toFormattedDateString,
  toFormattedDateTimeString,
  tomorrowsDate,
} from 'src/utils/DateUtils';
import hexToRgba from '@coreui/utils/dist/esm/hexToRgba';
import { getStyle } from '@coreui/utils';

const TIMEFRAME_ALL = 'All';
const TIMEFRAME_YTD = 'YTD';
const TIMEFRAME_YEAR = 'Year';

const filterMeasurements = (measurements: SimpleMeasurements, timeframe: string) => {
  if (timeframe === TIMEFRAME_ALL) {
    return measurements.slice();
  } else {
    const filterFromDate =
      timeframe === TIMEFRAME_YTD
        ? new Date(new Date().getFullYear(), 0, 1)
        : new Date(new Date().setFullYear(new Date().getFullYear() - 1));

    return measurements.slice().filter((x) => {
      return x.date >= filterFromDate;
    });
  }
};

const findMinDateTs = (measurements: SimpleMeasurements, timeframe: string): number => {
  switch (timeframe) {
    case TIMEFRAME_YTD:
      return new Date(new Date().getFullYear(), 0, 1).valueOf();
    case TIMEFRAME_YEAR:
      return new Date(new Date().setFullYear(new Date().getFullYear() - 1)).valueOf();
    default:
      console.log('All');
      console.log(measurements);
      return Math.min.apply(
        null,
        measurements.map((x) => x.date.valueOf()),
      );
  }
};

ChartJS.register(
  ...registerables,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
);

const buildOptions = (
  measurements: SimpleMeasurements,
  minDateTs: number,
  maxDateTs: number,
): Object => {
  return {
    response: true,
    maintainAspectRatio: false,
    showLine: true,
    animation: {
      duration: 500,
      easing: 'linear',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        callbacks: {
          title: function (tooltipItem: any) {
            return toFormattedDateTimeString(
              new Date(tooltipItem[0].dataset.data[tooltipItem[0].dataIndex].x),
              false,
            );
          },
          /*label: function (tooltipItem: any, data: any) {
            console.log(tooltipItem);
            //return data['datasets'][0]['data'][tooltipItem['index']];
            // return 'krneki';
          },*/
        },
      },
    },

    scales: {
      x: {
        grid: {
          //display: false,
          drawOnChartArea: false,
        },
        ticks: {
          //maxTicksLimit: 7,
          stepSize:
            Math.round(
              Math.max.apply(
                Math,
                measurements.map((x) => x.date.valueOf()),
              ) /
                7 /
                5,
            ) * 5,
          //beginAtZero: true,
          //precision: 0,
          callback: (x: any) => toFormattedDateString(new Date(x)),
        },
        min: minDateTs,
        max: maxDateTs,
        adapters: {
          //date: { locale: enUS },
          date: {
            locale: enGB,
          },
          type: 'timeseries',
          distribution: 'linear',
          /*time: {
            parser: 'yyyy-MM-dd',
            unit: 'day',
            //parser: 'MM/DD/YYYY HH:mm',
            //tooltipFormat: 'll HH:mm',
            //unit: 'day',
            //unitStepSize: 1,
            displayFormats: {
              day: 'MM/DD/YYYY',
            },
            max: Date.now(),
          },*/
          title: {
            display: false,
            text: 'Date',
          },
        },
        time: {
          parser: 'yyyy-MM-dd',
          unit: 'day',
          max: Date.now(),
          tooltipFormat: 'MM/DD/YYYY', // <- HERE
          displayFormats: {
            millisecond: 'HH:mm:ss',
            second: 'HH:mm:ss',
            minute: 'HH:mm:ss',
            hour: 'HH:mm:ss',
            day: 'HH:mm:ss',
            week: 'HH:mm:ss',
            month: 'HH:mm:ss',
            quarter: 'HH:mm:ss',
            year: 'HH:mm:ss',
          },
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          maxTicksLimit: 10,
          //stepSize: Math.ceil(250 / 5),
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
  };
};

/*export const options = {
  response: true,
  showLine: true,
  legend: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 7,
        callback: (x: any) => toFormattedDateString(new Date(x)),
      },
      max: tomorrowsDate().valueOf(),
      adapters: {
        //date: { locale: enUS },
        date: {
          locale: enGB,
        },
        type: 'timeseries',
        distribution: 'linear',
        time: {
          parser: 'yyyy-MM-dd',
          unit: 'day',
          //parser: 'MM/DD/YYYY HH:mm',
          //tooltipFormat: 'll HH:mm',
          //unit: 'day',
          //unitStepSize: 1,
          displayFormats: {
            day: 'MM/DD/YYYY',
          },
          max: Date.now(),
        },
        title: {
          display: false,
          text: 'Date',
        },
      },
      time: {
        parser: 'yyyy-MM-dd',
        unit: 'day',
        max: Date.now(),
      },
    },
    y: {
      grid: {
        display: true,
      },
    },
  },
};*/

/*export const data = {
  datasets: [
    {
      data: values,
      label: 'Test label',
      fill: false,
    },
  ],
};*/

interface Props {
  title: string;
  subtitle?: string;
  label: string;
  measurements: SimpleMeasurements;
}

const MeasurementChartV2: React.FC<Props> = (props) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAME_ALL);
  const [measurements, setMeasurements] = useState(props.measurements);
  const [options, setOptions] = useState(
    buildOptions(measurements, findMinDateTs(measurements, timeframe), tomorrowsDate().valueOf()),
  );

  const onTimeframeChangeHandler = (value: string) => {
    setTimeframe(value);
  };

  useEffect(() => {
    const newMeasurements = filterMeasurements(props.measurements, timeframe);
    setMeasurements(newMeasurements);

    setOptions(
      buildOptions(
        newMeasurements,
        findMinDateTs(newMeasurements, timeframe),
        tomorrowsDate().valueOf(),
      ),
    );
  }, [props.measurements, timeframe]);

  const vals = measurements.map((mea) => {
    return {
      x: mea.date.valueOf(),
      y: mea.measurement,
    };
  });

  console.log(vals);
  console.log(Date.now() + 1);

  const data = {
    datasets: [
      {
        data: vals,
        backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
        borderColor: getStyle('--cui-info'),
        pointBackgroundColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
      },
    ],
  };

  /*const data = {
    datasets: [
      {
        label: 'A dataset',
        data: measurements.map((mea) => {
          return {
            x: mea.date,
            y: mea.measurement,
          };
        }),
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };*/

  /*const options = buildOptions(
    measurements,
    findMinDateTs(measurements),
    tomorrowsDate().valueOf(),
  );*/

  return (
    <Fragment>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                {props.title}
              </h4>
              <div className="small text-medium-emphasis">
                {props.subtitle !== null ? props.subtitle : ''}
              </div>
            </CCol>
            <CCol sm={7} className="float-end">
              <CButtonGroup className="float-end me-3">
                {[TIMEFRAME_YTD, TIMEFRAME_YEAR, TIMEFRAME_ALL].map((value) => (
                  <CButton
                    color="dark"
                    key={value}
                    className="mx-0"
                    active={value === timeframe}
                    onClick={onTimeframeChangeHandler.bind(null, value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <div
            className="chart-wrapper"
            style={{ height: '300px', marginTop: '40px', marginBottom: '40px' }}
          >
            <Scatter data-testid="canvas" options={options} data={data} />
          </div>
        </CCardBody>
      </CCard>
    </Fragment>
  );
};
/*return (
    <Fragment>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                {props.title}
              </h4>
              <div className="small text-medium-emphasis">
                {props.subtitle !== null ? props.subtitle : ''}
              </div>
            </CCol>
            <CCol sm={7} className="float-end">
              <CButtonGroup className="float-end me-3">
                {['YTD', 'Year', 'All'].map((value) => (
                  <CButton
                    color="dark"
                    key={value}
                    className="mx-0"
                    active={value === timeframe}
                    onClick={onTimeframeChangeHandler.bind(null, value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: measurements.map((x) => toFormattedDateString(x.date)),
              datasets: [
                {
                  label: props.label,
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointBackgroundColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: measurements.map((x) => x.measurement),
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    //beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    //max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 3,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
      </CCard>
    </Fragment>
  );
};*/

export default MeasurementChartV2;
