import { AppBar, Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import SimpleBar from 'simplebar-react';
import { useState, useEffect, useRef, useMemo } from "react";
import { useScrollbar } from 'providers/ScrollbarProvider.tsx';
import { trans } from "core/api/mock/transactions-data";
import { currencyFormat } from 'core/utils/format-functions';
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
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
        const now = new Date();
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        };
    });
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [isViewingDetails, setIsViewingDetails] = useState(false);

    const handleMonthChange = (monthIndex: number) => {
        setSelectedMonthIndex(monthIndex);
        setRangeType('month');
        setRangeLabel('');
        const start = new Date(new Date().getFullYear(), monthIndex, 1);
        const end = new Date(new Date().getFullYear(), monthIndex + 1, 0, 23, 59, 59);
        setDateRange({ start, end });
    };

    const handleRangeChange = (type: string, label: string, startDate?: Date, endDate?: Date) => {
        setRangeType(type);
        setRangeLabel(label);
        if (startDate && endDate) {
            setDateRange({ start: startDate, end: endDate });
        }
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCategoryClick = (category: string) => {
        setCategoryFilter(category);
        // stay on Expenses tab and render filtered transactions within it
        setValue(1);
    };

    const handleBackFromTransactions = () => {
        setCategoryFilter(null);
    };

    const { totalIncome, totalExpenses } = useMemo(() => {
        const filtered = trans.filter(tran => {
            const tranDate = new Date(tran.date);
            return tranDate >= dateRange.start && tranDate <= dateRange.end;
        });
        
        const income = filtered
            .filter(tran => tran.income === 'Yes')
            .reduce((sum, tran) => sum + tran.amount, 0);
        
        const expenses = filtered
            .filter(tran => tran.expense === 'Yes')
            .reduce((sum, tran) => sum + tran.amount, 0);
        
        return { totalIncome: income, totalExpenses: expenses };
    }, [dateRange]);

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
                    {!isViewingDetails && (
                        <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                            <Stack direction="row" spacing={2} justifyContent="space-around">
                                <Stack alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Total Income
                                    </Typography>
                                    <Typography variant="h6" color="success.main" fontWeight={600}>
                                        {currencyFormat(totalIncome)}
                                    </Typography>
                                </Stack>
                                <Stack alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Total Expenses
                                    </Typography>
                                    <Typography variant="h6" color="error.main" fontWeight={600}>
                                        {currencyFormat(totalExpenses)}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    )}
                    <Transactions 
                        startDate={dateRange.start} 
                        endDate={dateRange.end} 
                        categoryFilter={categoryFilter}
                        onViewingDetails={setIsViewingDetails}
                    />
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {categoryFilter ? (
                        <Transactions
                            startDate={dateRange.start}
                            endDate={dateRange.end}
                            categoryFilter={categoryFilter}
                            onBack={handleBackFromTransactions}
                        />
                    ) : (
                        <Expenses startDate={dateRange.start} endDate={dateRange.end} onCategoryClick={handleCategoryClick} />
                    )}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <Transactions startDate={dateRange.start} endDate={dateRange.end} othersOnly />
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
            const available = window.innerHeight - top + 20; // bottom buffer
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