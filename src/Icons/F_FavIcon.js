import * as React from "react"

const F_FavIcon = ({
    style = {},
    width = "40",
    height = "40",
    className = "",
    fill = "#5E6782",
    viewBox = "0 0 40 40"
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
            fill="#7F72FF"
            d="m12.087.348 3.478 3.304c1.305 1.218 2 2.87 2 4.696 0 1.739.696 3.391 1.913 4.609l.435.434 4-12.956M.26 11.913l4.783-.174c1.74-.087 3.479.609 4.696 1.826 1.217 1.218 2.87 1.826 4.609 1.826h.608L8.523 3.478M.26 28.435l3.218-3.479c1.218-1.304 2.87-2.087 4.609-2.087 1.74 0 3.304-.782 4.522-2l.434-.434L0 16.695M12.087 39.913l-.26-4.782a6.538 6.538 0 0 1 1.738-4.783c1.13-1.217 1.826-2.957 1.74-4.609v-.608L3.477 31.826M28.609 39.565l-3.566-3.13c-1.304-1.13-2.087-2.783-2.173-4.609-.087-1.739-.87-3.304-2.087-4.522l-.435-.434L16.87 40M39.913 27.478l-4.783.348c-1.739.174-3.478-.435-4.782-1.652-1.305-1.13-2.957-1.74-4.696-1.652h-.608L32 36.174M39.13 11.043l-3.043 3.653c-1.13 1.304-2.783 2.173-4.522 2.26a6.23 6.23 0 0 0-4.435 2.174l-.347.435L40 22.695M26.87 0l.434 4.783a6.362 6.362 0 0 1-1.565 4.87c-1.13 1.303-1.652 2.956-1.565 4.695l.087.608L35.739 7.74"
        />
    </svg>
);

export default F_FavIcon;



