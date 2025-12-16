"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./DashboardPage.module.css";

type BuildingRow = {
  name: string;
  total: number;
  occupied: number;
  available: number;
  cleaning: number;
  maintenance: number;
};

const BUILDINGS: BuildingRow[] = [
  { name: "Bldg 72", total: 40, occupied: 28, available: 10, cleaning: 1, maintenance: 1 },
  { name: "Bldg 73", total: 32, occupied: 18, available: 12, cleaning: 1, maintenance: 1 },
  { name: "Bldg 78", total: 28, occupied: 21, available: 6, cleaning: 1, maintenance: 0 },
  { name: "Bldg 103", total: 24, occupied: 14, available: 8, cleaning: 1, maintenance: 1 },
  { name: "Shwapnolok", total: 18, occupied: 12, available: 5, cleaning: 1, maintenance: 0 },
];

const LAST_5_MONTHS = [
  { label: "Aug", guests: 128 },
  { label: "Sep", guests: 142 },
  { label: "Oct", guests: 156 },
  { label: "Nov", guests: 171 },
  { label: "Dec", guests: 163 },
];

const LAST_WEEK = [
  { label: "Mon", guests: 22 },
  { label: "Tue", guests: 18 },
  { label: "Wed", guests: 27 },
  { label: "Thu", guests: 31 },
  { label: "Fri", guests: 35 },
  { label: "Sat", guests: 29 },
  { label: "Sun", guests: 24 },
];

function sum<T extends keyof BuildingRow>(key: T) {
  return BUILDINGS.reduce((acc, r) => acc + (r[key] as number), 0);
}

const CHART_PRIMARY = "#004991ff";

export default function DashboardPage() {
  const totalRooms = React.useMemo(() => sum("total"), []);
  const occupiedTonight = React.useMemo(() => sum("occupied"), []);
  const availableTonight = React.useMemo(() => sum("available"), []);

  const [range, setRange] = React.useState<"months" | "week">("months");

  const chartData = range === "months" ? LAST_5_MONTHS : LAST_WEEK;
  const chartTitle = range === "months" ? "Guest Frequency (Last 5 Months)" : "Guest Frequency (Last Week)";

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Tonight snapshot + building status + guest trend</p>
      </div>

      {/* Top summary cards */}
      <div className={styles.cardsGrid}>
        <SummaryCard
          title="Total Rooms"
          value={totalRooms}
          meta="Inventory baseline"
        />
        <SummaryCard
          title="Occupied Tonight"
          value={occupiedTonight}
          meta="Confirmed stays"
        />
        <SummaryCard
          title="Available Tonight"
          value={availableTonight}
          meta="Sellable rooms"
        />
      </div>

      {/* Lower section: table + chart */}
      <div className={styles.lowerGrid}>
        <section className={styles.panel}>
          <div className={styles.panelTop}>
            <div className={styles.panelTitle}>Building-wise State</div>
            <div className={styles.panelMeta}>Tonight</div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Building</th>
                  <th className={styles.num}>Total</th>
                  <th className={styles.num}>Occupied</th>
                  <th className={styles.num}>Available</th>
                  <th className={styles.num}>Cleaning</th>
                  <th className={styles.num}>Maint.</th>
                </tr>
              </thead>
              <tbody>
                {BUILDINGS.map((b) => (
                  <tr key={b.name}>
                    <td className={styles.building}>{b.name}</td>
                    <td className={styles.num}>{b.total}</td>
                    <td className={styles.num}>{b.occupied}</td>
                    <td className={styles.num}>{b.available}</td>
                    <td className={styles.num}>{b.cleaning}</td>
                    <td className={styles.num}>{b.maintenance}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className={styles.footerLabel}>Total</td>
                  <td className={styles.num}>{totalRooms}</td>
                  <td className={styles.num}>{occupiedTonight}</td>
                  <td className={styles.num}>{availableTonight}</td>
                  <td className={styles.num}>{sum("cleaning")}</td>
                  <td className={styles.num}>{sum("maintenance")}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelTop}>
            <div>
              <div className={styles.panelTitle}>{chartTitle}</div>
              <div className={styles.panelMeta}>Arrivals / stays count (mock)</div>
            </div>

            <div className={styles.toggleGroup} role="tablist" aria-label="Guest frequency range">
              <button
                type="button"
                className={styles.toggleBtn}
                data-active={range === "months" ? "1" : "0"}
                onClick={() => setRange("months")}
              >
                Last 5 Months
              </button>
              <button
                type="button"
                className={styles.toggleBtn}
                data-active={range === "week" ? "1" : "0"}
                onClick={() => setRange("week")}
              >
                Last Week
              </button>
            </div>
          </div>

          <div className={styles.chartWrap}>
            <AnimatePresence mode="wait">
              <motion.div
                key={range}
                className={styles.chartInner}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(10,10,10,0.9)",
                      }}
                      labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                    />
                    <Bar
                      dataKey="guests"
                      radius={[10, 10, 4, 4]}
                      fill={CHART_PRIMARY}
                      activeBar={{ fill: "#1491B8" }}
                    />

                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  meta,
}: {
  title: string;
  value: number;
  meta: string;
}) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardValue}>{value}</div>
      <div className={styles.cardMeta}>{meta}</div>
    </motion.div>
  );
}
