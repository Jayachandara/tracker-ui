import { Box, IconButton, Stack, Typography, Popover, MenuItem, TextField, Button } from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { useState } from "react";

interface MonthRangeSelectorProps {
    selectedMonthIndex: number;
    onMonthChange: (monthIndex: number) => void;
    rangeType: string;
    rangeLabel: string;
    onRangeChange: (type: string, label: string, startDate?: Date, endDate?: Date) => void;
}

const MonthRangeSelector = ({
    selectedMonthIndex,
    onMonthChange,
    rangeType,
    rangeLabel,
    onRangeChange
}: MonthRangeSelectorProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [monthAnchorEl, setMonthAnchorEl] = useState<HTMLElement | null>(null);
    const [showCustom, setShowCustom] = useState<boolean>(false);
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');

    const months = Array.from({ length: 12 }, (_, i) => 
        new Date(2000, i).toLocaleString(undefined, { month: 'short' })
    );

    const handleMonthChange = (monthIndex: number) => {
        const start = new Date(new Date().getFullYear(), monthIndex, 1);
        const end = new Date(new Date().getFullYear(), monthIndex + 1, 0, 23, 59, 59);
        onMonthChange(monthIndex);
        setMonthAnchorEl(null);
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
        s.setHours(0, 0, 0, 0);
        const e = new Date(customEnd);
        e.setHours(23, 59, 59, 999);
        const sLabel = s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const eLabel = e.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        onRangeChange('custom', `${sLabel} - ${eLabel}`, s, e);
        handleClose();
    };

    const handleThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        onMonthChange(now.getMonth());
        onRangeChange('month', '', start, end);
        handleClose();
    };

    const handleLast3Months = () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setMonth(start.getMonth() - 2);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        onRangeChange('3months', `${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`, start, end);
        handleClose();
    };

    const handleLast6Months = () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        onRangeChange('6months', `${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`, start, end);
        handleClose();
    };

    const handle1Year = () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setMonth(start.getMonth() - 11);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        onRangeChange('1year', `${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`, start, end);
        handleClose();
    };

    const handleAllTime = () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date(2000, 0, 1);
        start.setHours(0, 0, 0, 0);
        onRangeChange('alltime', 'All Time', start, end);
        handleClose();
    };

    return (
        <Stack alignItems="center" direction={{ sm: 'row' }} spacing={1}>
            <Typography variant="subtitle1" color={'grey'}>
                {rangeType === 'month' ? months[selectedMonthIndex] : rangeLabel}
            </Typography>
            <IconButton 
                size="medium"
                onClick={(e) => setMonthAnchorEl(e.currentTarget)}
                sx={{ 
                    p: 0.5, 
                    ml: 0.5,
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
            >
                <IconifyIcon icon="mdi:chevron-down" style={{ fontSize: '25px', color: 'gray' }} />
            </IconButton>
            <Popover
                open={Boolean(monthAnchorEl)}
                anchorEl={monthAnchorEl}
                onClose={() => setMonthAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 1 }}>
                    {months.map((m, idx) => (
                        <MenuItem 
                            key={idx} 
                            onClick={() => handleMonthChange(idx)}
                            selected={idx === selectedMonthIndex}
                            sx={{ 
                                py: 1,
                                px: 2
                            }}
                        >
                            {m}
                        </MenuItem>
                    ))}
                </Box>
            </Popover>
            <IconButton 
                color="inherit"
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
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        elevation: 2,
                        sx: { 
                            mt: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider'
                        }
                    }
                }}
            >
                {!showCustom ? (
                    <Box sx={{ py: 0.5 }}>
                        <MenuItem 
                            onClick={handleThisMonth} 
                            sx={{ 
                                py: 1,
                                px: 2.5,
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <IconifyIcon 
                                icon={rangeType === 'month' ? "mdi:circle" : "mdi:circle-outline"}
                                style={{ fontSize: '16px', color: rangeType === 'month' ? '#1976d2' : '#bdbdbd' }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>This Month</Typography>
                        </MenuItem>
                        <MenuItem 
                            onClick={handleLast3Months} 
                            sx={{ 
                                py: 1,
                                px: 2.5,
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <IconifyIcon 
                                icon={rangeType === '3months' ? "mdi:circle" : "mdi:circle-outline"}
                                style={{ fontSize: '16px', color: rangeType === '3months' ? '#1976d2' : '#bdbdbd' }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>Last 3 Months</Typography>
                        </MenuItem>
                        <MenuItem 
                            onClick={handleLast6Months} 
                            sx={{ 
                                py: 1,
                                px: 2.5,
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <IconifyIcon 
                                icon={rangeType === '6months' ? "mdi:circle" : "mdi:circle-outline"}
                                style={{ fontSize: '16px', color: rangeType === '6months' ? '#1976d2' : '#bdbdbd' }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>Last 6 Months</Typography>
                        </MenuItem>
                        <MenuItem 
                            onClick={handle1Year} 
                            sx={{ 
                                py: 1,
                                px: 2.5,
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <IconifyIcon 
                                icon={rangeType === '1year' ? "mdi:circle" : "mdi:circle-outline"}
                                style={{ fontSize: '16px', color: rangeType === '1year' ? '#1976d2' : '#bdbdbd' }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>Last 1 Year</Typography>
                        </MenuItem>
                        <MenuItem 
                            onClick={handleAllTime} 
                            sx={{ 
                                py: 1,
                                px: 2.5,
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <IconifyIcon 
                                icon={rangeType === 'alltime' ? "mdi:circle" : "mdi:circle-outline"}
                                style={{ fontSize: '16px', color: rangeType === 'alltime' ? '#1976d2' : '#bdbdbd' }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>All Time</Typography>
                        </MenuItem>
                        <MenuItem 
                            onClick={() => setShowCustom(true)} 
                            sx={{ 
                                py: 1,
                                px: 2.5,
                                gap: 1.5,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            <IconifyIcon 
                                icon={rangeType === 'custom' ? "mdi:circle" : "mdi:circle-outline"}
                                style={{ fontSize: '16px', color: rangeType === 'custom' ? '#1976d2' : '#bdbdbd' }}
                            />
                            <Typography variant="body2" sx={{ flex: 1 }}>Custom Range</Typography>
                        </MenuItem>
                    </Box>
                ) : (
                    <Box sx={{ p: 2.5, minWidth: 280 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Select Date Range
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Start Date"
                                type="date"
                                size="small"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                size="small"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Stack>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
                            <Button size="small" onClick={() => setShowCustom(false)} sx={{ textTransform: 'none' }}>
                                Cancel
                            </Button>
                            <Button size="small" variant="contained" onClick={applyCustomRange} sx={{ textTransform: 'none' }}>
                                Apply
                            </Button>
                        </Box>
                    </Box>
                )}
            </Popover>
        </Stack>
    );
};

export default MonthRangeSelector;
