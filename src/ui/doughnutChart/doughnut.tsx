import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  values: number[];
  labels?: string[];
  backgroundColor?: string[];
  borderColor?: string[];
}

const DoughnutChartComponent = ({ labels, values, backgroundColor, borderColor }: DoughnutChartProps) => {
  if (!values) return null;
  return (
    <Doughnut
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
      data={{
        labels: labels ?? [],
        datasets: [
          {
            label: '#',
            data: values,
            backgroundColor: backgroundColor ?? ['#5B98AB', '#CEE1E6'],
            borderColor: borderColor ?? ['#5B98AB', '#CEE1E6'],
            borderWidth: 1,
          },
        ],
      }}
    />
  );
};

export const DoughnutChart = memo(DoughnutChartComponent);
