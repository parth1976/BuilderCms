import * as React from "react"

const F_EditIcon = ({
    style = {},
    width = "20",
    height = "21",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 20 21"
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
            fill={fill}
            d="M20 5.24a1 1 0 0 0-.29-.71L15.47.29a1 1 0 0 0-.71-.29 1 1 0 0 0-.71.29l-2.83 2.83L.29 14.05a1.001 1.001 0 0 0-.29.71V19a1 1 0 0 0 1 1h4.24a1.001 1.001 0 0 0 .76-.29L16.87 8.78 19.71 6a1.19 1.19 0 0 0 .22-.33c.01-.08.01-.16 0-.24a.697.697 0 0 0 0-.14l.07-.05ZM4.83 18H2v-2.83l9.93-9.93 2.83 2.83L4.83 18ZM16.17 6.66l-2.83-2.83 1.42-1.41 2.82 2.82-1.41 1.42Z"
        />
    </svg>
);

export default F_EditIcon;
