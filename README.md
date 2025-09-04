# Geo Inspector Tool

![Geo Inspector UI](https://placehold.co/800x400.png)
*<p align="center">Replace with a screenshot of your app</p>*

**Geo Inspector** is a web-based tool designed to help developers and network engineers analyze API performance and behavior from multiple geographical locations. It simulates API requests from different countries, measures response latency, and uses Generative AI to analyze responses for potential geolocation-specific clues.

---

## ✨ Key Features

- **Multi-Location Inspection**: Test any API endpoint from a list of global locations simultaneously.
- **Country-Based Selection**: Easily select target geolocations by country name.
- **Latency Measurement**: Get the response time in milliseconds for each request.
- **Detailed API Response**: View the full HTTP status, headers, and body for each location's response.
- **AI-Powered Analysis**: Leverage Genkit and Google's Gemini model to automatically analyze responses for subtle geolocation clues.
- **Result Exporting**: 
  - Download a summary of results in a clean, table-formatted **PDF**, complete with your app logo.
  - Copy the full, detailed results to your clipboard as a **JSON** object.
- **Modern & Responsive UI**: Built with Next.js, ShadCN/UI, and Tailwind CSS for a great experience on any device.

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ShadCN/UI](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Genkit](https://img.shields.io/badge/Genkit-663399?style=for-the-badge&logo=google-cloud&logoColor=white)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/geo-inspector.git
    cd geo-inspector
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables:**
    The application uses Google's Generative AI for analysis. You'll need a Gemini API key.

    - Create a `.env` file in the root of the project by copying the example file:
      ```bash
      cp .env.example .env
      ```
    - Open the newly created `.env` file and add your Gemini API key:
      ```
      GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
      ```
    - You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This command runs the Next.js app on `http://localhost:9002` by default.

2.  **Open your browser:**
    Navigate to [http://localhost:9002](http://localhost:9002) to see the application.

---

## 📖 How to Use the App

1.  **Navigate to the Inspector Tool:** From the landing page, click the "Launch Inspector" or "Start Inspecting Now" button.
2.  **Enter API Endpoint:** Input the full URL of the API you want to test (e.g., `https://api.example.com/v1/data`).
3.  **Select Locations:** Choose one or more countries from the dropdown menus. Use the "Add Another Location" button to add more.
4.  **Inspect:** Click the "Inspect Endpoints" button to start the analysis.
5.  **Analyze Results:**
    - The results will appear in an accordion view, one for each location.
    - Each item shows a summary including the location, API status, and response time.
    - Click on any result to expand it and see the detailed API Response (Headers and Body) and the AI-powered Geo Clue Analysis.
6.  **Download or Copy:**
    - Use the **PDF icon** to download a formatted report of the results.
    - Use the **Share icon** to copy the complete results data as JSON to your clipboard.

---

## 📂 Project Structure

-   `src/app/`: Main application directory using Next.js App Router.
    -   `page.tsx`: The landing page component.
    -   `layout.tsx`: The root layout for all pages, including the footer and global SEO.
    -   `inspector/page.tsx`: The main page for the Geo Inspector tool.
    -   `actions.ts`: Server Actions for handling form submissions and backend logic.
-   `src/ai/`: Contains all AI-related code.
    -   `flows/analyze-geo-clues.ts`: The Genkit flow that interacts with the Gemini model.
-   `src/components/`: Reusable React components.
    -   `ui/`: Components from ShadCN/UI.
    -   `geo-inspector-form.tsx`: The main form for inputting endpoint and locations.
    -   `response-display.tsx`: Component to display the API response.
    -   `analysis-display.tsx`: Component to display the AI analysis.
-   `src/lib/`: Utility functions and shared libraries.
    -   `countries.ts`: Data source for country names and coordinates.
-   `public/`: Static assets like images and fonts.

---

## 📬 Contact

Your Name – SRYVPRASAD@gmail.com

Project Link: [https://github.com/SRYVPRASAD/geo-inspector](https://github.com/SRYVPRASAD/geo-inspector)
