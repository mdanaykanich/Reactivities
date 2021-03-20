import { observer } from "mobx-react-lite";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Dropdown, Image, Menu } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

const NavBar = () => {
	const {
		userStore: { user, logout },
	} = useStore();
	return (
		<Menu fixed='top' inverted style={{ zIndex: 1000 }}>
			<Container>
				<Menu.Item as={NavLink} to='/' exact header>
					<img
						src='/assets/logo.png'
						alt='logo'
						style={{ marginRight: "10px" }}
					/>
					Reactivities
				</Menu.Item>
				<Menu.Item as={NavLink} to='/activities' name='Activities' />
				<Menu.Item>
					<Button
						as={NavLink}
						to='/createActivity'
						positive
						content='Create Activity'
					/>
				</Menu.Item>
				<Menu.Item as={NavLink} to='/errors' name='Errors' />
				<Menu.Item position='right'>
					<Image
						src={user?.image || "/assets/user.png"}
						avatar
						spaced='right'
					/>
					<Dropdown pointing='top left' text={user?.displayName}>
						<Dropdown.Menu>
							<Dropdown.Item
								as={Link}
								to={`/profiles/${user?.username}`}
								text='My Profile'
								icon='user'
							/>
							<Dropdown.Item onClick={logout} text='Logout' icon='power' />
						</Dropdown.Menu>
					</Dropdown>
				</Menu.Item>
			</Container>
		</Menu>
	);
};

export default observer(NavBar);
