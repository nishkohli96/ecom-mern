import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { batch } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AdbIcon from '@mui/icons-material/Adb';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  useAppSelector,
  useAppDispatch,
  ThemeSelector,
  UserSelector,
  toggleTheme,
  setUser,
  setUserCartInfo,
  openToast,
  setToastMessage,
  setToastStatus,
  defaultUserCartValue,
  useUserLogoutMutation,
} from 'redux-store';
import { GroceryAutocomplete, ThemeMode } from 'shared';
import { useCartQuantity } from 'hooks';
import RouteList from 'routes/route-list';

const userMenu = [
  { text: 'Profile', to: RouteList.profile.rootPath },
  { text: 'Account', to: RouteList.account.rootPath },
];

const guestMenu = [
  {
    text: 'Login',
    to: `${RouteList.auth.rootPath}/${RouteList.auth.subPaths.login}`,
  },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const theme = useAppSelector(ThemeSelector);
  const user = useAppSelector(UserSelector);
  const num_cart_items = useCartQuantity();

  const menuOptions = user ? userMenu : guestMenu;
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const userText = `Hi ${user ? user?.name?.first : 'Guest'}`;

  const [userLogout] = useUserLogoutMutation();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path: string) => {
    handleCloseUserMenu();
    navigate(path);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    userLogout()
      .unwrap()
      .then((payload) => {
        batch(() => {
          dispatch(setUser(null));
          dispatch(setUserCartInfo(defaultUserCartValue));
          dispatch(setToastMessage(payload));
          dispatch(setToastStatus('success'));
          dispatch(openToast());
        });
      })
      .catch((err) =>
        batch(() => {
          dispatch(setToastMessage(err));
          dispatch(setToastStatus('error'));
          dispatch(openToast());
        })
      );
  };

  const ToggleThemeButton = () => (
    <Tooltip title="Toggle Theme">
      <IconButton
        size="large"
        aria-label="toggle theme"
        onClick={() => dispatch(toggleTheme())}
        color="inherit"
      >
        {theme === ThemeMode.LIGHT ? (
          <NightlightRoundIcon />
        ) : (
          <LightModeIcon />
        )}
      </IconButton>
    </Tooltip>
  );

  const CartButton = () => (
    <Tooltip title="View Cart">
      <IconButton
        size="large"
        aria-label={
          num_cart_items ? `view ${num_cart_items} cart items` : 'view cart'
        }
        onClick={() => navigate('/cart')}
        color="inherit"
      >
        <Badge badgeContent={num_cart_items} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );

  return (
    <AppBar
      position="static"
      sx={(theme) => ({
        background: theme.palette.primary.main,
        /**
         * Override the default borderRadius of paper
         * component set in theme
         */
        borderRadius: 0,
      })}
    >
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ marginRight: '1rem' }}
        >
          <AdbIcon onClick={() => navigate('/')} />
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <GroceryAutocomplete />
        </Box>
        <ToggleThemeButton />
        <CartButton />
        <Box onClick={handleOpenUserMenu} sx={{ marginLeft: '0.5rem' }}>
          {user ? (
            <Avatar
              src={user.avatar}
              alt={`${user.name.first} ${user.name.last}`}
            />
          ) : (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
        </Box>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <Box sx={{ fontWeight: 500, minWidth: 150, padding: '6px 16px' }}>
            {userText}
          </Box>
          {menuOptions.map((op) => (
            <MenuItem key={op.text} onClick={() => handleNavigation(op.to)}>
              <Typography textAlign="center">{op.text}</Typography>
            </MenuItem>
          ))}
          {user && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
