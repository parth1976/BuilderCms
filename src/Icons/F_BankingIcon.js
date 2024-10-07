import * as React from "react"

const F_BankingIcon = ({
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
            d="M19 8a1 1 0 0 0 1-1V4a.999.999 0 0 0-.684-.948l-9-3a1.002 1.002 0 0 0-.632 0l-9 3A.999.999 0 0 0 0 4v3a1 1 0 0 0 1 1h1v7.185A2.995 2.995 0 0 0 0 18v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a2.995 2.995 0 0 0-2-2.815V8h1Zm-1 11H2v-1a1.001 1.001 0 0 1 1-1h14a1.001 1.001 0 0 1 1 1v1ZM4 15V8h2v7H4Zm4 0V8h4v7H8Zm6 0V8h2v7h-2ZM2 6V4.721l8-2.667 8 2.667v1.28H2Z"
            fill={fill}
        />
    </svg>
);

export default F_BankingIcon;



