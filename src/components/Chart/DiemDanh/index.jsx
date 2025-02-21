"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { getDayOfWeek } from "../../../DefaultActions";

// const data = [
//   { day: "Thứ 2", checkInOnTime: 5, checkInLate: 2, checkOutOnTime: 6, checkOutLate: 1 },
//   { day: "Thứ 3", checkInOnTime: 7, checkInLate: 1, checkOutOnTime: 6, checkOutLate: 2 },
//   { day: "Thứ 4", checkInOnTime: 6, checkInLate: 2, checkOutOnTime: 7, checkOutLate: 1 },
//   { day: "Thứ 5", checkInOnTime: 8, checkInLate: 1, checkOutOnTime: 7, checkOutLate: 2 },
//   { day: "Thứ 6", checkInOnTime: 9, checkInLate: 0, checkOutOnTime: 8, checkOutLate: 1 },
//   { day: "Thứ 7", checkInOnTime: 4, checkInLate: 3, checkOutOnTime: 5, checkOutLate: 2 },
//   { day: "Chủ Nhật", checkInOnTime: 3, checkInLate: 2, checkOutOnTime: 4, checkOutLate: 1 },
// ];

export default function DiemDanh({ data }) {

    const formattedData = getDayOfWeek(data);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={formattedData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar
                    dataKey="checkInDungGio"
                    stackId="checkin"
                    fill="#4CAF50"
                    name="Check-in Đúng giờ"
                />
                <Bar
                    dataKey="checkInTre"
                    stackId="checkin"
                    fill="#FFC107"
                    name="Check-in Trễ"
                />

                <Bar
                    dataKey="checkOutDungGio"
                    stackId="checkout"
                    fill="#2196F3"
                    name="Check-out Đúng giờ"
                />
                <Bar
                    dataKey="checkOutSom"
                    stackId="checkout"
                    fill="#F44336"
                    name="Check-out sớm"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
