import { NavLink } from "react-router";
import FavButton from "./FavButton";
import "./Header.css";

const Header = ({ title, currentSection }: HeaderProps) => {
	return (
		<header>
			<div className="container">
				<NavLink to="/" id="logo">
					<img src="assets/images/logo.svg" alt="" />
				</NavLink>

				<div className="wrapper-title">
					<span>{title}</span>

					{currentSection === 'watch' &&
						<>
							<FavButton />
						</>
					}
				</div>

				<nav>
				</nav>
			</div>
		</header>
	)
};

export default Header;