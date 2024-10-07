import * as React from "react";

const F_PrintIcon = ({
    style = {},
    width = "20",
    height = "20",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 20 20",
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
            className="f_fill"
            fill={fill}
            d="M5 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm12-4h-1V1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3H3a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3h1a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3ZM6 2h8v2H6V2Zm8 16H6v-4h8v4Zm4-5a1 1 0 0 1-1 1h-1v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6Z"
        />
    </svg>
);

export default F_PrintIcon;
