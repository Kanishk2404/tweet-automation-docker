import { Link } from "react-router-dom";

export default function NewDashboard(){

    return (
        <>
            <h1 className="text-center">Welcome to DashBoard</h1>
            <div className="m-5 p-5 flex-column items-center">
                <h1 className="m-3">Services we offer</h1>
                <ul className="m-2 p-5">
                    <li><Link to="/tweet">Tweet</Link></li>
                    <li><Link to="/linkedin">Linkedin</Link></li>
                </ul>
            </div>
        </>
    )
}