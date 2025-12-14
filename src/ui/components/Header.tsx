import { NavLink, useLocation, useParams } from "react-router";
import "./Header.css";

const Header = () => {
	const location = useLocation();
	const params = useParams();

	return (
		<header>
			<div className="container">
				<NavLink to="/" id="logo">
					<img src="assets/images/logo.svg" alt="" />
				</NavLink>

				<div className="wrapper-title">
				</div>

				<nav>
				</nav>
			</div>
		</header>
	)
};

export default Header;