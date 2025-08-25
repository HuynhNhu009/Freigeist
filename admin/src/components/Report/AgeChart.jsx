import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'
import { getAgeGroups } from '../../api/api'

const COLORS = ['#3366ff', '#ff3b3b', '#ff9900', '#00cc66', '#9933ff', '#666666']

export default function AgeChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    getAgeGroups().then(setData)
  }, [])

  return (
    <div className="flex gap-8 flex-wrap justify-center">
      <div className="w-72">
        <h2 className="text-md font-semibold text-center mb-2">age-group-based</h2>
        <PieChart width={300} height={300}>
          <Pie data={data} dataKey="value" nameKey="group" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div className="w-[400px]">
        <BarChart width={400} height={250} data={data}>
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3399ff" />
        </BarChart>
      </div>
    </div>
  )
}
