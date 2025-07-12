import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="text-lg font-bold">Interview Analyzer</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/submit">Submit</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}
