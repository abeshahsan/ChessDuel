import React from "react";

import WhiteKingIcon from "@/app/piece_icons/white-king.png";
import BlackKingIcon from "@/app/piece_icons/black-king.png";
import WhiteQueenIcon from "@/app/piece_icons/white-queen.png";
import BlackQueenIcon from "@/app/piece_icons/black-queen.png";
import WhiteRookIcon from "@/app/piece_icons/white-rook.png";
import BlackRookIcon from "@/app/piece_icons/black-rook.png";
import WhiteBishopIcon from "@/app/piece_icons/white-bishop.png";
import BlackBishopIcon from "@/app/piece_icons/black-bishop.png";
import WhiteKnightIcon from "@/app/piece_icons/white-knight.png";
import BlackKnightIcon from "@/app/piece_icons/black-knight.png";
import WhitePawnIcon from "@/app/piece_icons/white-pawn.png";
import BlackPawnIcon from "@/app/piece_icons/black-pawn.png";

const ImageComponent = ({ src, alt, style }: { src: string; alt: string; style?: React.CSSProperties }) => (
	<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
		<img
			draggable='false'
			style={{ width: "90%", aspectRatio:"1", ...style }}
			src={src}
			alt={alt}
		/>
	</div>
);

export const WhiteKing = ({ style }: { style?: React.CSSProperties }) => {
	return (
		<ImageComponent
			src={WhiteKingIcon.src}
			alt='White King'
			style={style}
		/>
	);
};

export const WhiteQueen = ({ style }: { style?: React.CSSProperties }) => {
	return (
		<ImageComponent
			src={WhiteQueenIcon.src}
			alt='White Queen'
			style={style}
		/>
	);
};

export const WhiteRook = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={WhiteRookIcon.src}
		alt='White Rook'
		style={style}
	/>
);

export const WhiteBishop = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={WhiteBishopIcon.src}
		alt='White Bishop'
		style={style}
	/>
);

export const WhiteKnight = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={WhiteKnightIcon.src}
		alt='White Knight'
		style={style}
	/>
);

export const WhitePawn = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={WhitePawnIcon.src}
		alt='White Pawn'
		style={style}
	/>
);

export const BlackKing = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={BlackKingIcon.src}
		alt='Black King'
		style={style}
	/>
);

export const BlackQueen = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={BlackQueenIcon.src}
		alt='Black Queen'
		style={style}
	/>
);

export const BlackRook = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={BlackRookIcon.src}
		alt='Black Rook'
		style={style}
	/>
);

export const BlackBishop = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={BlackBishopIcon.src}
		alt='Black Bishop'
		style={style}
	/>
);

export const BlackKnight = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={BlackKnightIcon.src}
		alt='Black Knight'
		style={style}
	/>
);

export const BlackPawn = ({ style }: { style?: React.CSSProperties }) => (
	<ImageComponent
		src={BlackPawnIcon.src}
		alt='Black Pawn'
		style={style}
	/>
);
