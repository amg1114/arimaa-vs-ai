/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
    theme: {
        extend: {
            colors:{
                "white-cell": "#fffcf2",
                "yellow-cell": "#ffe6a7",
            }
        },
    },
    plugins: [import("flowbite/plugin")],
};
