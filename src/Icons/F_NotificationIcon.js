import * as React from "react"

const F_NotificationIcon = ({
    style = {},
    width = "22",
    height = "28",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 22 28"
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
            d="M19 15.574v-4.24a8 8 0 0 0-6.667-7.88V2a1.333 1.333 0 0 0-2.666 0v1.454A8 8 0 0 0 3 11.334v4.24a4 4 0 0 0-2.667 3.76V22a1.333 1.333 0 0 0 1.334 1.334h4.186a5.334 5.334 0 0 0 10.294 0h4.186A1.333 1.333 0 0 0 21.667 22v-2.666A4 4 0 0 0 19 15.574Zm-13.333-4.24a5.333 5.333 0 1 1 10.666 0v4H5.667v-4ZM11 24.667a2.667 2.667 0 0 1-2.293-1.333h4.586A2.667 2.667 0 0 1 11 24.667Zm8-4H3v-1.333A1.333 1.333 0 0 1 4.333 18h13.334A1.333 1.333 0 0 1 19 19.334v1.333Z"
            fill={fill}
        />
    </svg>
);

export default F_NotificationIcon;



