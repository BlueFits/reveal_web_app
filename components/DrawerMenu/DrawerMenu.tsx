import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

interface IDrawerMenu {
    open: boolean;
    onClose: any;
}

const DrawerMenu: React.FC<IDrawerMenu> = ({ open, onClose }) => {
    return (
        <Drawer
            PaperProps={{
                sx: { width: "100%" },
            }}
            anchor={"right"}
            open={open}
            onClose={onClose}
        >
            <List>
                <ListItem>
                    <ListItemText>
                        <Typography fontWeight="bold" variant="h5">
                            Reveal
                        </Typography>
                    </ListItemText>
                    <IconButton onClick={onClose} style={{ color: "grey" }}>
                        <Close />
                    </IconButton>
                </ListItem>
            </List>
            <Divider />
        </Drawer>
    );
};

export default DrawerMenu;