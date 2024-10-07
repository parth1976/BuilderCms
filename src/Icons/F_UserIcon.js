import * as React from "react"

const F_UserIcon = ({
    style = {},
    width = "20",
    height = "22",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 20 22"
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
            d="M13.71 11.71a6 6 0 1 0-7.42 0 10 10 0 0 0-6.22 8.18 1.006 1.006 0 0 0 2 .22 8 8 0 0 1 15.9 0 1 1 0 0 0 1 .89h.11a1 1 0 0 0 .88-1.1 10 10 0 0 0-6.25-8.19ZM10 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
            fill={fill}
        />
    </svg>
);

export default F_UserIcon;



