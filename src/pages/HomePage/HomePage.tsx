import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { PieChart } from "react-minimal-pie-chart";
import "./HomePage.css"

const CountSleep: React.FC = () => {
  const [counts, setCounts] = useState({
    light: 0,
    deep: 0,
    rem: 0,
    awake: 0,
  });

  useEffect(() => {
    fetchCsvData();
  }, []);

  const fetchCsvData = () => {
    const filePath = "/csv/sleep_data.csv"; // Percorso del file CSV nella cartella del progetto
    fetch(filePath)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: false,
          complete: (result) => {
            const data = result.data as string[][];
            countStages(data.flat());
          },
        });
      })
      .catch((error) => {
        console.error("Errore nel caricamento del file CSV:", error);
      });
  };

  const countStages = (data: string[]) => {
    const stageCounts = { light: 0, deep: 0, rem: 0, awake: 0 };
    data.forEach((word) => {
      const lowerWord = word.toLowerCase();
      if (stageCounts.hasOwnProperty(lowerWord)) {
        stageCounts[lowerWord as keyof typeof stageCounts]++;
      }
    });
    setCounts(stageCounts);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const totalMinutes = counts.light + counts.deep + counts.rem + counts.awake;

  const chartData = [
    { title: "Awake", value: counts.awake, color: "#FF6600" },
    { title: "REM", value: counts.rem, color: "#54D1F1" },
    { title: "Light", value: counts.light, color: "#8799FF" },
    { title: "Deep", value: counts.deep, color: "#2020FF" },
  ];

  return (
    <div>
      <h1 className="title">MONITORAGGIO DEL SONNO</h1>
      <div className="pie">
        <PieChart
          data={chartData}
          lineWidth={15}
          startAngle={270}
          paddingAngle={3}
        />
      </div>
      <div>
        <ul className="list">
          <li>AWAKE: {formatTime(counts.awake)}</li>
          <li>REM: {formatTime(counts.rem)}</li>
          <li>LIGHT: {formatTime(counts.light)}</li>
          <li>DEEP: {formatTime(counts.deep)}</li>
        </ul>
        <h2 className="total">Total Sleep Time:</h2>
        <p>{formatTime(totalMinutes)}</p>
        <h2 className="ratio">Sleep Time Rate:</h2>
        <p>{(((totalMinutes)-counts.awake)*100/480)*0.5 + (((counts.deep)+(counts.rem))*100/totalMinutes)*0.5 - ((counts.awake)*100/totalMinutes)}</p>
      </div>
    </div>
  );
};

export default CountSleep;
