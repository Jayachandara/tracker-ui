import { AppBar, Box, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import SimpleBar from 'simplebar-react';
import IconifyIcon from "components/base/IconifyIcon";
import { useState, useEffect, useRef } from "react";
import { useScrollbar } from 'providers/ScrollbarProvider.tsx';
import Transactions from "./Transactions";
import StyledTabs from "components/ui/StyledTabs";
import StyledTab from "components/ui/StyledTab";
import Expenses from "./Expenses/Expenses";

const AllTrasanctions = () => {

    const theme = useTheme();
    const [value, setValue] = useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Stack
            bgcolor="background.paper"
            borderRadius={5}
            width={1}
            boxShadow={(theme) => theme.shadows[4]}
            height={1}
        >
            <Stack
                direction={{ sm: 'row' }}
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                gap={3}
            >
                <Typography paddingLeft={1} variant="h6" color="text.primary">
                    Monthly Tracking
                </Typography>
                <Grid>
                    <Stack alignItems="center"
                        direction={{ sm: 'row' }}>

                        <Typography variant="subtitle1" color={'grey'}>Nov</Typography>
                        <IconButton color="inherit"
                            sx={{
                                width: 40,
                                height: 40,
                                p: 1,
                                bgcolor: 'inherit',
                            }}
                        >
                            <IconifyIcon color={'gray'} icon="mdi:filter" />
                        </IconButton>
                    </Stack>
                </Grid>

            </Stack>

            <Box >
                <AppBar position="static" sx={{ padding: '5px 25px', backgroundColor: '#fff' }}>
                    <StyledTabs
                        variant="fullWidth"
                        value={value}
                        onChange={handleChange}
                        aria-label="styled tabs example"
                    >
                        <StyledTab label="All" />
                        <StyledTab label="Expenses" />
                        <StyledTab label="Others" />
                    </StyledTabs>
                </AppBar>
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <Transactions />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Expenses />
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    Item Three
                </TabPanel>
            </Box>
        </Stack>
    )

}


export default AllTrasanctions;

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    const { showScrollbar: globalShow } = useScrollbar();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
        function updateHeight() {
            const el = containerRef.current;
            if (!el) return;
            const top = el.getBoundingClientRect().top;
            const available = window.innerHeight - top; // bottom buffer
            setMaxHeight(available > 150 ? Math.floor(available) : 150);
        }
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <div
            ref={containerRef}
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    <SimpleBar
                        className={!globalShow ? 'simplebar-hidden-scrollbar' : undefined}
                        style={{ maxHeight: maxHeight ? `${maxHeight}px` : '65vh' }}
                    >
                        <Box sx={{ p: 1.5 }}>{children}</Box>
                    </SimpleBar>
                </Box>
            )}
        </div>
    );
}