import { NavLink, useParams } from "react-router";
import { useFavorites } from "../hooks/useFavorites";
import IconHeart from "./icons/IconHeart";
import "./Header.css";

const Header = ({ currentSection }: HeaderProps) => {
	const params = useParams();
	const { favorites, setFavorites } = useFavorites();

	const handleAddToFavorites = (e: any) => {
		if (currentSection != 'watch') return;
		if (!params.videoId) return;

		window.api.addFavorite({ videoId: params.videoId, videoTitle: '' })
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
					{currentSection === 'home' && <span>Home</span>}

					{currentSection === 'watch' &&
						<>
							<span>Video Title Example</span>
							<button onClick={handleAddToFavorites}>
								<IconHeart fill="#bf0101" />
							</button>
						</>
					}

					{currentSection === 'search' &&
						<span>Searching</span>
					}

					{currentSection === 'favorites' &&
						<span>Favorites</span>
					}
				</div>

				<nav>
				</nav>
			</div>
		</header>
	)
};

export default Header;