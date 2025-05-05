import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../main";
import { getAuth } from "firebase/auth";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, startOfWeek, endOfWeek } from "date-fns";
import './Trend.css'
import Navbar from "./../Navbar/Navbar.tsx";

interface TrendData {
  date: string; 
  score: number; 
}

const TrendPage: React.FC = () => {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [filteredData, setFilteredData] = useState<TrendData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd")); 
  const [viewMode, setViewMode] = useState<"monthly" | "weekly">("monthly");

  useEffect(() => {
    if (!userId) return;

    const fetchTrendData = async () => {
      try {
        const userTrendDocRef = doc(db, "trend", userId);
        const userTrendDoc = await getDoc(userTrendDocRef);

        if (userTrendDoc.exists()) {
          const data = userTrendDoc.data().data as TrendData[];
          setTrendData(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dati del trend:", error);
      }
    };

    fetchTrendData();
  }, [userId]);

  useEffect(() => {
    
    const date = new Date(selectedDate);

    if (viewMode === "monthly") {
      const startDate = startOfMonth(date);
      const endDate = endOfMonth(startDate);
      const allDays = eachDayOfInterval({ start: startDate, end: endDate }).map((day) =>
        format(day, "yyyy-MM-dd")
      );

      const completeData = allDays.map((date) => {
        const dayData = trendData.find((item) => item.date === date);
        return { date, score: dayData ? dayData.score : 0 };
      });

      setFilteredData(completeData);
    } else if (viewMode === "weekly") {
      const startDate = startOfWeek(date, { weekStartsOn: 1 });
      const endDate = endOfWeek(date, { weekStartsOn: 1 });
      const allDays = eachDayOfInterval({ start: startDate, end: endDate }).map((day) =>
        format(day, "yyyy-MM-dd")
      );

      const completeData = allDays.map((date) => {
        const dayData = trendData.find((item) => item.date === date);
        return { date, score: dayData ? dayData.score : 0 };
      });

      setFilteredData(completeData);
    }
  }, [trendData, selectedDate, viewMode]);

  return (
    <div className="p-4">
      <Navbar />
      <h1 className="titolo">TREND UTENTE</h1>
      
      <div className="titolo">
        <label>Seleziona visualizzazione: </label>
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as "monthly" | "weekly")}
          className="date"
        >
          <option value="monthly">Mensile</option>
          <option value="weekly">Settimanale</option>
        </select>
      </div>

      <div className="titolo">
        <label>Seleziona una data: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date"
        />
      </div>

      <ResponsiveContainer width={1400} height={500}>
        <BarChart data={filteredData}>
          <CartesianGrid stroke="none" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip contentStyle={{color: "white" }}
            labelStyle={{ color: "#60a5fa" }} />
          <Legend />
          <Bar dataKey="score" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendPage;
