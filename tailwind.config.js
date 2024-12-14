/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {
            colors:{
                "white-cell": "#fffcf2",
                "yellow-cell": "rgb(255, 214, 111)",
                "silver-cell": "#b9b9b9",
                "gold-cell": "#eed602",
            },
            fontFamily: {
                "bungee": ["Bungee", "cursive"],
            }
        },
    },
    plugins: [import("flowbite/plugin")],
};
