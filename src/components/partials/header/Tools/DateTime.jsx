import React, { useEffect, useState } from "react";

const DateTime = () => {
    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            );
            var year = now.toLocaleString("default", { year: "numeric" });
            var month = now.toLocaleString("default", { month: "short" });
            var day = now.toLocaleString("default", { day: "2-digit" });
            const date =[day, month, year].join(' ')
            setCurrentDate(date);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <span>
            <div className="flex-none text-slate-600 text-white text-sm font-semibold items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
                <span className="overflow-hidden text-ellipsis whitespace-nowrap block">

                    {currentDate} <span style={{ fontSize: "1.2rem", verticalAlign: "bottom", margin: '.3rem' }}>
                        &bull;
                    </span>{" "} {currentTime}
                </span>
            </div>
        </span>
    );
};

export default DateTime;
