import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Cookies from 'js-cookie';
import { Button, useMediaQuery } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
// import DarkModeSwitch from './DarkModeSwitch';
import { useTheme } from '@mui/material/styles';
import { CiLogout } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion'; // Import Framer Motion
import { useDispatch } from 'react-redux';
import { getLogin } from '../redux/slices';

export interface SimpleDialogProps {
  open: boolean;
  selectedValue?: string;
  onClose: (value: string) => void;
}

// interface User {
//   username: string;
//   profile?: string;
// }

const SideBox: React.FC<SimpleDialogProps> = ({ open, onClose }) => {
  const [user, setUser] = useState<any | null>(null);
  const [image, setImage] = useState<string>('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const userCookie = Cookies.get('user');
  useEffect(() => {
    try {
      if (userCookie) {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
        setImage(parsedUser.user.profile || '');
      }
    } catch (error) {
      console.error('Failed to parse user from cookies', error);
    }
  }, [userCookie]);

  const handleListItemClick = () => {
    Cookies.remove('user');
    dispatch(getLogin(false));
    navigate('/');
    onClose('');
  };

  // Animation variants
  const dialogVariants = {
    hidden: { opacity: 0, x: isMobile ? '-100%' : '100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { opacity: 0, x: isMobile ? '-100%' : '100%', transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          onClose={() => onClose('')}
          open={open}
          fullWidth={isMobile}
          maxWidth="xs"
          PaperProps={{
            style: {
              margin: isMobile ? '0' : '1rem',
              marginLeft: isMobile ? '0' : '100rem',
              marginTop: isMobile ? '0' : '-30rem',
              width: isMobile ? '70%' : 'auto',
              maxWidth: '95%',
            },
            component: motion.div,
            variants: dialogVariants,
            initial: "hidden",
            animate: "visible",
            exit: "exit"
          }}
        >
          <DialogTitle sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', paddingLeft: isMobile ? '1rem' : '2rem' }}>
            {image && (
              <motion.img
                src={image}
                alt="User Profile"
                style={{ marginRight: '0.5rem', borderRadius: '50%', height: "6rem", width: "6rem", marginLeft: "3rem" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            )}
            <motion.span
              style={{ fontWeight: "bolder", marginTop: "2rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {user?.user.username || 'Guest'}
            </motion.span>
          </DialogTitle>
          <List sx={{ pt: 0, paddingLeft: isMobile ? '1rem' : '2rem', paddingRight: isMobile ? '1rem' : '2rem' }}>
            <motion.div variants={listItemVariants} initial="hidden" animate="visible">
              <ListItem disableGutters>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {/* <DarkModeSwitch /> */}
                  {/* <span style={{ marginLeft: '0.5rem' }}>Theme</span> */}
                </div>
              </ListItem>
            </motion.div>
            <motion.div variants={listItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <ListItem disableGutters>
                <FaRegUserCircle />
                <NavLink to="/about"><Button fullWidth={isMobile}>Profile</Button></NavLink>
              </ListItem>
            </motion.div>
            <motion.div variants={listItemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <ListItem disableGutters>
                <CiLogout />
                <Button fullWidth={isMobile} onClick={handleListItemClick}>
                  Logout
                </Button>
              </ListItem>
            </motion.div>
          </List>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default SideBox;