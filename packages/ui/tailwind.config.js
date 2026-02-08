/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "../../packages/ui/src/**/*.{ts,tsx}",
        "../../packages/blocks/src/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
