import { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { IUserReducer } from '../../../../services/modules/User/userSlice';
import { IReducer } from '../../../../services/store';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className='h-full border-2'
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                children
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const MatchesPage = () => {
    const userReducer: IUserReducer = useSelector((state: IReducer) => state.user);
    const [value, setValue] = useState(0);

    useEffect(() => {
        console.log("my reducer", userReducer);
    }, [userReducer]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs variant='fullWidth' indicatorColor='secondary' textColor='secondary' value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Matches" {...a11yProps(0)} />
                    <Tab label="Messages" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className='flex justify-center items-center h-full'>
                    <Typography variant='h4'>No Matches</Typography>
                </div>
            </TabPanel>
        </Box>
    );
}

export default MatchesPage;