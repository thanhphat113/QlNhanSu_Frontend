import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ReferenceLine,
    ResponsiveContainer,
} from "recharts";
import { getDayOfWeek } from "../../../DefaultActions";

// console.log(formatData);

function ChiTietTheoCa({ data }) {
    const format = getDayOfWeek(data?.data);

    const formatData = format?.map((item) => {
        const checkIn = item.thoiGianBatDau - data.batDau;
        const checkOut = data.ketThuc - item.thoiGianKetThuc;

        if (checkIn > 0 || checkOut > 0) {
            return {
                day: item.day,
                start: item.thoiGianKetThuc ? item.thoiGianBatDau : null,
                heightIsVerify: item.thoiGianKetThuc ? 0 : null,
                heightIsNotVerify: item.thoiGianKetThuc
                    ? Math.round(
                          (item.thoiGianKetThuc - item.thoiGianBatDau) * 100
                      ) / 100
                    : null,
            };
        }

        return {
            day: item.day,
            start: item.thoiGianKetThuc ? item.thoiGianBatDau : null,
            heightIsNotVerify: item.thoiGianKetThuc ? 0 : null,
            heightIsVerify: item.thoiGianKetThuc
                ? Math.round(
                      (item.thoiGianKetThuc - item.thoiGianBatDau) * 100
                  ) / 100
                : null,
        };
    });

    function CustomTooltip({ payload, label }) {
        if (payload && payload.length) {
            const dataIsVerify = payload[1];
            const dataIsNotVerify = payload[2];
            return (
                <div className={`p-5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)]`}>
                    <p>{`${label}`}</p>
                    <p className={dataIsVerify?.value ? "text-[#4CAF50]":"text-[#FF0000]"}>
                        {dataIsVerify?.value !== 0
                            ? `Tổng thời gian làm việc: ${dataIsVerify.value} tiếng`
                            : `Tổng thời gian làm việc: ${dataIsNotVerify.value} tiếng`}
                    </p>
                </div>
            );
        }
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                width={500}
                height={300}
                data={formatData}
                stackOffset="sign"
                margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis
                    domain={[12, 24]}
                    label={{
                        value: "Tổng thời gian (giờ)", 
                        angle: -90, 
                        position: "insideLeft",
                        style: {
                            textAnchor: "middle",
                            fontSize: 14, 
                            fontWeight: "bold",
                        },
                    }}
                />
                {data && <Tooltip content={<CustomTooltip />} />}
                <Legend />
                <ReferenceLine
                    y={data?.batDau}
                    strokeDasharray="3 3"
                    stroke="#000"
                    label={data?.batDau}
                    name={data?.batDau}
                />
                <ReferenceLine
                    y={data?.ketThuc}
                    stroke="#000"
                    strokeDasharray="3 3"
                    label={data?.ketThuc}
                    name={data?.ketThuc}
                />

                <Bar
                    dataKey="start"
                    stackId="stack"
                    visibility={true}
                    // fill="#8884d8"
                    legendType="none"
                    // name="hehe"
                    opacity={0} // Không hiển thị cột start
                />
                <Bar
                    dataKey="heightIsVerify"
                    name="Tổng thời gian làm việc"
                    fill="#4CAF50"
                    stackId="stack"
                />
                <Bar
                    dataKey="heightIsNotVerify"
                    name="Tổng thời gian làm việc (Có vi phạm)"
                    fill="#FF0000"
                    stackId="stack"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default ChiTietTheoCa;
