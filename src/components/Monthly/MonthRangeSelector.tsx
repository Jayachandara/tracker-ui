import { Box, IconButton, Stack, Typography, Popover, MenuItem, TextField, Button } from "@mui/material";
import IconifyIcon from "components/base/IconifyIcon";
import { useState } from "react";

interface MonthRangeSelectorProps {
    selectedMonthIndex: number;
    onMonthChange: (monthIndex: number) => void;
    rangeType: string;
    rangeLabel: string;
    onRangeChange: (type: string, label: string) => void;
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
        const e = new Date(customEnd);
        const sLabel = s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const eLabel = e.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        onRangeChange('custom', `${sLabel} - ${eLabel}`);
        handleClose();
    };

    const handleThisMonth = () => {
        onMonthChange(new Date().getMonth());
        onRangeChange('month', '');
        handleClose();
    };

    const handleLast3Months = () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 2);
        onRangeChange('3months', `${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`);
        handleClose();
    };

    const handleLast6Months = () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        onRangeChange('6months', `${start.toLocaleString(undefined, { month: 'short' })} - ${end.toLocaleString(undefined, { month: 'short' })}`);
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
                <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                    {months.map((m, idx) => (
                        <MenuItem 
                            key={idx} 
                            selected={idx === selectedMonthIndex}
                            onClick={() => handleMonthChange(idx)}
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
            >
                <Box sx={{ p: 1, minWidth: 220 }}>
                    {!showCustom ? (
                        <>
                            <MenuItem onClick={handleThisMonth}>This Month</MenuItem>
                            <MenuItem onClick={handleLast3Months}>Last 3 Months</MenuItem>
                            <MenuItem onClick={handleLast6Months}>Last 6 Months</MenuItem>
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
                                <Button size="small" onClick={() => setShowCustom(false)}>Cancel</Button>
                                <Button size="small" variant="contained" onClick={applyCustomRange}>Apply</Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Popover>
        </Stack>
    );
};

export default MonthRangeSelector;
