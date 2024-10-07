import * as React from "react";

const F_TotalBalanceIcon = ({
    style = {},
    width = "30",
    height = "24",
    className = "",
    stroke = "#5E6782",
    viewBox = "0 0 30 24",
}) => (
    <svg
        width={width}
        style={style}
        height={height}
        viewBox={viewBox}
        stroke={stroke}
        xmlns="http://www.w3.org/2000/svg"
        className={`${className || ""}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <path
            className="f_stroke"
            fill="transparent"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7.5 10.5a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3v-9Z"
        />
        <path
            className="f_stroke"
            fill="transparent"
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M22.5 7.5v-3a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h3M15 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
        />
    </svg>
);

export default F_TotalBalanceIcon;
