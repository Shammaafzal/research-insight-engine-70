import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];
const tip = { borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 };

export function FieldDistributionChart({ data }: { data: { field: string; count: number }[] }) {
  return (
    <div className="h-72">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: -16 }}>
          <XAxis dataKey="field" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" interval={0} tickFormatter={(v: string) => (v.length > 14 ? v.slice(0, 12) + "…" : v)} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
          <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={tip} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FieldShareChart({ data }: { data: { field: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-48 w-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="field" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.slice(0, 5).map((d, i) => (
          <li key={d.field} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="flex-1 truncate">{d.field}</span>
            <span className="font-mono text-xs text-muted-foreground">{Math.round((d.count / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
