import { Drawer, List, ListItem, ListItemText, IconButton, Divider, Typography, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface IDrawerComponent {
    isOpen: boolean;
    onCloseHandler: () => void;
    title: string;
    children: any;
}

const DrawerComponent: React.FC<IDrawerComponent> = ({ isOpen = false, onCloseHandler, title, children }) => {
    return (
        <Drawer
            PaperProps={{
                sx: { width: "100%", height: "100%" },
            }}
            anchor={"right"}
            open={isOpen}
            onClose={onCloseHandler}
        >
            <List>
                <ListItem>
                    <IconButton sx={{ marginRight: 1 }} onClick={onCloseHandler} style={{ color: "grey" }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <ListItemText>
                        <Typography fontWeight="bold" variant="h6">
                            {title}
                        </Typography>
                    </ListItemText>
                </ListItem>
            </List>
            <Divider />
            {children}
            {/* {isLoading &&
                <div className="bg-white h-screen w-screen absolute">
                    <Loading />
                </div>
            } */}
        </Drawer>
    );
};

export default DrawerComponent;