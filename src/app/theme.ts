// src/theme.ts
import { createTheme } from "@mui/material/styles";

// Create a light theme
const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
		error: {
			main: "#f44336",
		},
		background: {
			default: "#f5f5f5",
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: "2.5rem",
			fontWeight: 500,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 500,
		},
	},
	spacing: 8,
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
});

// Create a dark theme
const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#90caf9",
		},
		secondary: {
			main: "#f48fb1",
		},
		error: {
			main: "#ef5350",
		},
		background: {
			default: "#121212",
			paper: "#1d1d1d",
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: "2.5rem",
			fontWeight: 500,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 500,
		},
	},
	spacing: 8,
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
});

export { lightTheme, darkTheme };
