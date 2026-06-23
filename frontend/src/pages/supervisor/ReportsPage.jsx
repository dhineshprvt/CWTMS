import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import reportService from '../../services/reportService';
import { CATEGORY_LABELS } from '../../utils/statusColors';

export default function ReportsPage() {
  const [performance, setPerformance] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    reportService.workerPerformance().then((res) => setPerformance(res.data));
    reportService.taskSummary().then((res) => setSummary(res.data));
  }, []);

  const categoryChartData = summary
    ? Object.entries(summary.byCategory).map(([key, value]) => ({
        category: CATEGORY_LABELS[key] || key,
        count: value,
      }))
    : [];

  return (
    <div>
      <h4 className="mb-4">Reports</h4>

      <div className="bg-white p-3 rounded shadow-sm mb-4">
        <h6>Tasks by Category</h6>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-3 rounded shadow-sm">
        <h6>Worker Performance</h6>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Worker</th>
                <th>Total Assigned</th>
                <th>Approved</th>
                <th>Rejected</th>
                <th>Rework</th>
                <th>Pending</th>
                <th>Approval Rate</th>
              </tr>
            </thead>
            <tbody>
              {performance.map((p) => (
                <tr key={p.workerId}>
                  <td>{p.workerName}</td>
                  <td>{p.totalAssigned}</td>
                  <td>{p.approved}</td>
                  <td>{p.rejected}</td>
                  <td>{p.reworkRequired}</td>
                  <td>{p.pending}</td>
                  <td>{p.approvalRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
