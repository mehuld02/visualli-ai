# 🧭 Overview

Multi-Layered Water Cycle Visualization is an interactive web app built using React and D3.js to help users explore hierarchical relationships within the Water Cycle through zoomable, circular layers.
Each layer represents a conceptual level — e.g., the main Water Cycle, its sub-processes (Evaporation, Condensation), and their deeper elements (Ocean, River, Clouds, etc.).

# Users can:

- Zoom in/out interactively using mouse clicks or scrolls

- Navigate layers step-by-step or jump directly via the sidebar

- Return to the top level using a Home icon

- See a clean, animated visualization that updates dynamically

# 🧩 Design
🎨 UI/UX Approach

The interface is divided into two main areas:

## 1.Left Sidebar (Navigation Panel)

- 🏠 Home Button: Returns to root (Water Cycle)

- 🔵 Layer Bubbles: Represent visited layers; click to revisit directly

## 2.Right Visualization Area

- Displays interactive nodes using D3 circle packing logic

- Nodes are positioned radially around the center depending on the layer

- Transitions are animated for smooth zoom and re-layout effects

# ⚙️ Tech Choices
## 1. React.js

Chosen for modular UI development, state management (useState, useEffect), and reactivity for DOM updates.

## 2. D3.js

Used for:

- SVG manipulation

- Circle positioning and layout (d3.select, transitions)

- Animated transitions during zoom

## 3. Lucide-React

Used for lightweight, modern icons (specifically the 🏠 Home icon).

## 4. Vite

Provides fast bundling, hot reload, and simple dev setup.

# 🚀 Setup & Run Locally
## 1️⃣ Clone the repository
git clone  https://github.com/mehuld02/visualli-ai.git
cd Visualli.ai

## 2️⃣ Install dependencies
npm install

## 3️⃣ Run the app
npm run dev


Now open http://localhost:5173 in your browser 🎨

# 🧰 How to Run Tests Manually

1.Open app in browser

2.Try:

- Left-click on a node to zoom in.

- Scroll down or right-click to zoom out.

- Click 🏠 Home icon to return to root

- Click any bubble in sidebar to jump to that layer

3.Confirm transitions are smooth and positions stable.

# 🪪 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it with attribution.