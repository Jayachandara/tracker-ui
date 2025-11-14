import { AppBar, Box, Grid, IconButton, Stack, Typography, useTheme, Popover, MenuItem, TextField, Button } from "@mui/material";
import SimpleBar from 'simplebar-react';
import IconifyIcon from "components/base/IconifyIcon";
import { useState, useEffect, useRef } from "react";
import { useScrollbar } from 'providers/ScrollbarProvider.tsx';
import Transactions from "./Transactions";
import StyledTabs from "theme/styles/StyledTabs";
import StyledTab from "theme/styles/StyledTab";
import Expenses from "./Expenses/Expenses";

const MonthlyTracking = () => {

    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [monthAnchorEl, setMonthAnchorEl] = useState<HTMLElement | null>(null);
    const [showCustom, setShowCustom] = useState<boolean>(false);
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');
    const [rangeType, setRangeType] = useState<string>('month'); // 'month', '3months', '6months', 'custom'
    const [rangeLabel, setRangeLabel] = useState<string>('');

    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth());

    const months = Array.from({ length: 12 }, (_, i) => 
        new Date(2000, i).toLocaleString(undefined, { month: 'short' })
    );

    const handleMonthChange = (monthIndex: number) => {
        setSelectedMonthIndex(monthIndex);
        setRangeType('month');
        setRangeLabel('');
    };

    const open = Boolean(anchorEl);

    const handleFilterClick = (e: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowCustom(false);
    };

    const applyCustomRange = () => {
        if (!customStart || !customEnd) return;
        const s = new Date(customStart);
        const e = new Date(customEnd);
        const sLabel = s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const eLabel = e.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        setRangeType('custom');
        setRangeLabel(`${sLabel} - ${eLabel}`);
        handleClose();
    };

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
                        direction={{ sm: 'row' }}
                        spacing={1}>

                        <Typography variant="subtitle1" color={'grey'}>
                            {rangeType === 'month' ? months[selectedMonthIndex] : rangeLabel}
                        </Typography>
                        <IconButton 
                            size="small"
                            onClick={(e) => setMonthAnchorEl(e.currentTarget)}
                            sx={{ p: 0, ml: 0.5 }}
                        >
                            <IconifyIcon icon="mdi:chevron-down" fontSize="small" />
                        </IconButton>
                        <Popover
                            open={Boolean(monthAnchorEl)}
                            anchorEl={monthAnchorEl}
                            onClose={() => setMonthAnchorEl(null)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        >
                            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                {months.map((m, idx) => (
                                    <MenuItem 
                                        key={idx} 
                                        selected={idx === selectedMonthIndex}
                                        onClick={() => { 
                                            handleMonthChange(idx); 
                                            setMonthAnchorEl(null); 
                                        }}
                                    >
                                        {m}
                                    </MenuItem>
                                ))}
                            </Box>
                        </Popover>
                        <IconButton color="inherit"
                            sx={{
                                width: 40,
                                height: 40,
                                p: 1,
                                bgcolor: 'inherit',
                            }}
                            onClick={handleFilterClick}
                        >
                            <IconifyIcon color={'gray'} icon="mdi:filter" />
                        </IconButton>
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <Box sx={{ p: 1, minWidth: 220 }}>
                                {!showCustom ? (
                                    <>
                                        <MenuItem onClick={() => { 
                                            setSelectedMonthIndex(new Date().getMonth()); 
                                            setRangeType('month'); 
                                            setRangeLabel('');
                                            handleClose(); 
                                        }}>This Month</MenuItem>
                                        <MenuItem onClick={() => { 
                                            setRangeType('3months'); 
                                            const end = new Date();
                                            const start = new Date();
                                            start.setMonth(start.getMonth() - 2);
                                            setRangeLabel(`${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`);
                                            handleClose(); 
                                        }}>Last 3 Months</MenuItem>
                                        <MenuItem onClick={() => { 
                                            setRangeType('6months'); 
                                            const end = new Date();
                                            const start = new Date();
                                            start.setMonth(start.getMonth() - 5);
                                            setRangeLabel(`${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`);
                                            handleClose(); 
                                        }}>Last 6 Months</MenuItem>
                                        <MenuItem onClick={() => setShowCustom(true)}>Custom Range</MenuItem>
                                    </>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
                                        <TextField
                                            label="Start"
                                            type="date"
                                            value={customStart}
                                            onChange={(e) => setCustomStart(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            label="End"
                                            type="date"
                                            value={customEnd}
                                            onChange={(e) => setCustomEnd(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                                            <Button size="small" onClick={() => { setShowCustom(false); }}>Cancel</Button>
                                            <Button size="small" variant="contained" onClick={applyCustomRange}>Apply</Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Popover>
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


export default MonthlyTracking;

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