#  🌱 CO₂ Emissions Calculator (v1)

## Overview
The CO2 Offset Calculator is a tool designed to help individuals and organizations estimate their carbon footprint and explore ways to offset it effectively.

## Key Features
- ⚡ **Energy Emissions Calculator**  
  Input your electricity usage (in kWh) to calculate your CO₂ emissions.

- 🗓️ **Custom Date Range Selection**  
  Choose exact start and end dates for the emissions calculation.

- 📊 **Dashboard with History & Charts**  
  View historical emissions data and corresponding visual insights.

- 🔁 **Real-Time Emission Factor Fetching**  
  Always uses the latest emission factor for electricity in Germany.

- 🧹 **Clear History Option**  
  Instantly delete stored emissions data from the dashboard.

- 📱 **Fully Responsive**  
  Optimized layout for both mobile and desktop experiences.

> 🧩 Coming in Iteration 2:
> - 📚 **Learn Page** – Educational content on emissions and offsetting.
> - 🧾 **Profile/Settings** – Manage personal preferences and history.

## Technologies Used
- **Frontend**: React (TypeScript + JSX), Vite
- **Styling**: Tailwind CSS
- **API**: [Climatiq API](https://www.climatiq.io/docs)
- **Database**: Firebase Firestore
- **State Management**: React Hooks
- **Charting**: Chart.js via `react-chartjs-2`
- **Other Tools**: Postman for API testing

## Getting Started
Follow the instructions below to set up and run the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Climatiq API key ([Get one here](https://www.climatiq.io/))
- Firebase project setup (for emissions history)

### Installation Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/Heizal/co2-offset-calculator.git
    ```
2. Navigate to the project directory:
    ```bash
    cd co2-offset-calculator
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the root directory.
    ```python
    VITE_CLIMATIQ_API_KEY=your_climatiq_api_key
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_PROJECT_ID=your_project_id
    ```
    ##### any other Firebase env values you need

5. Start the development server:
    ```bash
    npm run dev
    ```

### Using the API
1. Start the server as described above.
2. Access the API documentation at `https://www.climatiq.io/`
3. Example API endpoints:
    - `GET /api/emissions` - Retrieve emission data.
    - `POST /api/offset` - Submit offset calculations.

### Conceptual guide
A full conceptual guide with the system architecture can be found in the [CONCEPTUAL_GUIDE.md](docs/CONCEPTUAL_GUIDE.md)

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to your branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

Thank you for contributing to the project!