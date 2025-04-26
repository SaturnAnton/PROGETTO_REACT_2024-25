import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { PieChart } from "react-minimal-pie-chart";
import { Line } from "react-chartjs-2";
import {
  ChartOptions,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./HomePage.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SleepStageData {
  Timestamp: string;
  "Sleep Stage": string;
}

interface HypnogramChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
    backgroundColor: string;
    tension: number;
    pointRadius: number;
  }[];
}

const CountSleep: React.FC = () => {
  const [counts, setCounts] = useState({
    light: 0,
    deep: 0,
    rem: 0,
    awake: 0,
  });
  const [hypnogramData, setHypnogramData] = useState<HypnogramChartData | null>(null);

  useEffect(() => {
    fetchCsvData();
  }, []);

  const fetchCsvData = () => {
    const filePath = "/csv/sleep_data.csv";
    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.errors.length > 0) {
              console.error("Errori di parsing CSV:", result.errors);
              return;
            }
            const data = result.data as SleepStageData[];
            countStages(data.map((item) => item["Sleep Stage"]));
            processHypnogramData(data);
          },
        });
      })
      .catch((error) => {
        console.error("Errore nel caricamento del file CSV:", error);
      });
  };

  const countStages = (stages: string[]) => {
    const stageCounts = { light: 0, deep: 0, rem: 0, awake: 0 };
    stages.forEach((stage) => {
      const lowerStage = stage.toLowerCase();
      if (stageCounts.hasOwnProperty(lowerStage)) {
        stageCounts[lowerStage as keyof typeof stageCounts]++;
      }
    });
    setCounts(stageCounts);
  };

  const processHypnogramData = (data: SleepStageData[]) => {
    if (!data || data.length === 0) {
      setHypnogramData(null);
      return;
    }
  
    const timestamps = data.map((item) => {
      const date = new Date(item.Timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });
    
    const sleepStages = data.map((item) => item["Sleep Stage"]);
  
    const stageMapping: { [key: string]: number } = {
      Awake: 4,
      REM: 3,
      Light: 2,
      Deep: 1,
    };
  
    const numericSleepStages = sleepStages
      .map((stage) => stageMapping[stage] || 0)
      .filter((value) => value >= 1 && value <= 4);
  
    if (numericSleepStages.length === 0) {
      console.error("Dati dell'ipnogramma non validi o vuoti.");
      setHypnogramData(null);
      return;
    }
  
    const newHypnogramData: HypnogramChartData = {
      labels: timestamps,
      datasets: [
        {
          label: "Fase del Sonno",
          data: numericSleepStages,
          borderColor: "steelblue",
          fill: true,
          backgroundColor: "rgba(70,130,180,0.2)",
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };
    setHypnogramData(newHypnogramData);
  };
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const totalMinutes = counts.light + counts.deep + counts.rem + counts.awake;

  const calculateSleepRate = () => {
    if (totalMinutes === 0) return 0;
    const awakePenalty = ((counts.awake / totalMinutes) * 100);
    const restBonus =
      (((counts.deep + counts.rem) / totalMinutes) * 100) * 0.5 +
      ((totalMinutes - counts.awake) / 480) * 100 * 0.5;
    return restBonus - awakePenalty;
  };

  const pieChartData = [
    { title: "Awake", value: counts.awake, color: "#FF6600" },
    { title: "REM", value: counts.rem, color: "#54D1F1" },
    { title: "Light", value: counts.light, color: "#8799FF" },
    { title: "Deep", value: counts.deep, color: "#2020FF" },
  ];

  const hypnogramOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    color: 'white',
    scales: {
      y: {
        title: {
          display: true,
          text: "Fase del Sonno",
          color: 'white',
        },
        ticks: {
          callback: (value: number | string) => {
            const reversedMapping: { [key: number]: string } = {
              4: "Awake",
              3: "REM",
              2: "Light",
              1: "Deep",
            };
            return reversedMapping[Number(value)] || "";
          },
          color:'white',
        },
        min: 1, 
        max: 4, 
      },
      x: {
        title: {
          display: true,
          text: "Orario",
          color: 'white',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          color:'white'
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const reversedMapping: { [key: number]: string } = {
              4: "Awake",
              3: "REM",
              2: "Light",
              1: "Deep",
            };
            return `Fase: ${reversedMapping[value] || ""}`;
          },
        },
      },
    },
  };
  
  return (
    <div>
      <h1 className="title">MONITORAGGIO DEL SONNO</h1>
      <div className="pie">
        <PieChart data={pieChartData} lineWidth={15} startAngle={270} paddingAngle={3} />
      </div>
      <div>  
      <div className="hypnogram">
        <h2>Hypnogram</h2>
        {hypnogramData && <Line data={hypnogramData} options={hypnogramOptions} />}
        {!hypnogramData && <p>Dati dell'ipnogramma non disponibili.</p>}
      </div>
        <ul className="list">
          <li>AWAKE: {formatTime(counts.awake)}</li>
          <li>REM: {formatTime(counts.rem)}</li>
          <li>LIGHT: {formatTime(counts.light)}</li>
          <li>DEEP: {formatTime(counts.deep)}</li>
        </ul>
        <h2 className="total">Total Sleep Time:</h2>
        <p>{formatTime(totalMinutes)}</p>
        <h2 className="ratio">Sleep Time Rate:</h2>
        <p>{calculateSleepRate().toFixed(2)}</p>
      </div>

      
    </div>
  );
};

export default CountSleep;
