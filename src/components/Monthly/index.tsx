import { AppBar, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import SimpleBar from 'simplebar-react';
import { useState, useEffect, useRef } from "react";
import { useScrollbar } from 'providers/ScrollbarProvider.tsx';
import Transactions from "./Transactions";
import StyledTabs from "theme/styles/StyledTabs";
import StyledTab from "theme/styles/StyledTab";
import Expenses from "./Expenses/Expenses";
import MonthRangeSelector from "./MonthRangeSelector";

const MonthlyTracking = () => {

    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth());
    const [rangeType, setRangeType] = useState<string>('month');
    const [rangeLabel, setRangeLabel] = useState<string>('');

    const handleMonthChange = (monthIndex: number) => {
        setSelectedMonthIndex(monthIndex);
        setRangeType('month');
        setRangeLabel('');
    };

    const handleRangeChange = (type: string, label: string) => {
        setRangeType(type);
        setRangeLabel(label);
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
                    <MonthRangeSelector
                        selectedMonthIndex={selectedMonthIndex}
                        onMonthChange={handleMonthChange}
                        rangeType={rangeType}
                        rangeLabel={rangeLabel}
                        onRangeChange={handleRangeChange}
                    />
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