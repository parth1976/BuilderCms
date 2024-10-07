import * as React from "react"

const F_ChangePasswordIcon = ({
    style = {},
    width = "20",
    height = "20",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 20 20"
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
        <path className="f_fill"
            d="M17 0H3a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3Zm1 17a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14ZM10 6a2 2 0 0 0-2 2 2 2 0 0 0 1 1.72V13a1 1 0 1 0 2 0V9.72A2 2 0 0 0 12 8a2 2 0 0 0-2-2Z"
            fill={fill}
        />
    </svg>
);

export default F_ChangePasswordIcon;



