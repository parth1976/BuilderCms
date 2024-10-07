import * as React from "react";

const F_ReportLedgerIcon = ({
    style = {},
    width = "15",
    height = "18",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 15 18",
}) => (
    <svg
        width={width}
        style={style}
        height={height}
        viewBox={viewBox}
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
        className={`${className || ""}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
        <path
            fill={fill}
            className="f_fill"
            d="M3.8 5.802a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM3.8 9.802a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM4.366 13.568a.8.8 0 1 1-1.132-1.132.8.8 0 0 1 1.132 1.132ZM5.433 5a.75.75 0 0 1 .75-.75h4.8a.75.75 0 1 1 0 1.5h-4.8a.75.75 0 0 1-.75-.75ZM6.183 8.25a.75.75 0 0 0 0 1.5h4.8a.75.75 0 1 0 0-1.5h-4.8ZM5.433 13a.75.75 0 0 1 .75-.75h4.8a.75.75 0 1 1 0 1.5h-4.8a.75.75 0 0 1-.75-.75Z"
        />
        <path
            fill={fill}
            className="f_fill"
            fillRule="evenodd"
            d="M1.8.25A1.55 1.55 0 0 0 .25 1.8v14.4c0 .856.694 1.55 1.55 1.55H13a1.55 1.55 0 0 0 1.55-1.55V1.8A1.55 1.55 0 0 0 13 .25H1.8ZM1.75 1.8a.05.05 0 0 1 .05-.05H13a.05.05 0 0 1 .05.05v14.4a.05.05 0 0 1-.05.05H1.8a.05.05 0 0 1-.05-.05V1.8Z"
            clipRule="evenodd"
        />
    </svg>
);

export default F_ReportLedgerIcon;
