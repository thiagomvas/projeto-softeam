// Filename - App.js

import "./App.css";
// importing components from react-router-dom package
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";

// import Home component
import Login from "./Components/LoginPage";
import Register from "./Components/RegisterPage";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route
            path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>
					<Route
						path="*"
						element={<Navigate to="/login" />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
