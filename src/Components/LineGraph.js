import React, { useEffect,useState} from 'react'
import { Line } from 'react-chartjs-2'
import numeral from "numeral"

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  mainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      lable: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
      ],
      yAxes: [
          {
              gridLines: {
                  display:false,
              },
              ticks: {
                  callback: function (value, index, values) {
                      return numeral(value).format("0a");
                  }
              }
          }
      ]
  },
};

 const buildChartData = (data, casesType = "cases") => {
   const chartData = [];
   let lastDataPoint;
   for (let date in data.cases) {
     if (lastDataPoint) {
       const newDataPoint = {
         x: date,
         y: data[casesType][date] - lastDataPoint,
       };
       chartData.push(newDataPoint);
     }
     lastDataPoint = data[casesType][date];
   }
   return chartData;
 };
function LineGraph({ casesType="cases",...props }) {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchedData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChartData(data,casesType);
          setData(chartData);
        });
    };
    fetchedData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                data: data,
                borderColor: "#cc1031",
                backgroundColor: "rgba(204,16,52,0.5)",
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph
