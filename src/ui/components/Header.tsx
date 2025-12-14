import { NavLink, useLocation, useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import IconHeart from "./icons/IconHeart";
import "./Header.css";

const Header = () => {
	const pathname = useLocation().pathname;
	const params = useParams();
	const { favorites, setFavorites } = useFavorites();

	console.log(`params on Header: ${JSON.stringify(params)}`);

	const handleAddToFavorites = (e: any) => {
		if (pathname.split('/')[1] != 'watch') return;

		window.api.addFavorite({ videoId: pathname.split('/')[2], videoTitle: '' })
			.then((favs) => {
				e.target.classList.add('active');
				setFavorites(favs);
			});
	};

	return (
		<header>
			<div className="container">
				<NavLink to="/" id="logo">
					<img src="assets/images/logo.svg" alt="" />
				</NavLink>

				<div className="wrapper-title">
					{pathname === '/' && <span>Home</span>}

					{pathname.split('/')[1] === 'watch' &&
						<>
							<span>Video Title Example</span>
							<button onClick={handleAddToFavorites}>
								<IconHeart fill="#bf0101" />
							</button>
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