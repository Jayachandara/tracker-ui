import { Box, IconButton, Stack, Typography, TextField, Select, MenuItem, Button, Switch, Popover } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { TransactionDTO } from 'domain/transactions/types';
import { getCategoryConfig } from 'core/config/category-config';
import { useState, useMemo } from 'react';

interface TransactionEditProps {
    transaction: TransactionDTO;
    onBack: () => void;
    onSave: (transaction: TransactionDTO) => void;
}

const TransactionEdit = ({ transaction, onBack, onSave }: TransactionEditProps) => {
    const [editedTransaction, setEditedTransaction] = useState<TransactionDTO>({ ...transaction });
    const [editingKey, setEditingKey] = useState<null | 'amount' | 'place' | 'datetime' | 'account' | 'tags' | 'note'>(null);
    const [dateTimeAnchor, setDateTimeAnchor] = useState<HTMLElement | null>(null);

    const formatDateTime = (dateStr: string, timeStr: string) => {
        const date = new Date(dateStr);
        const currentYear = new Date().getFullYear();
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        
        // Parse time and format to 12-hour with AM/PM
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const formattedTime = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        
        // Format date based on year
        const dateFormat = year === currentYear 
            ? `${day} ${month}` 
            : `${day} ${month}'${year.toString().slice(-2)}`;
        
        return `${dateFormat} ${formattedTime}`;
    };

    const categoryConfig = getCategoryConfig(editedTransaction.category);
    const CategoryIcon = categoryConfig.icon;

    const hasChanges = useMemo(() => {
        return JSON.stringify(transaction) !== JSON.stringify(editedTransaction);
    }, [transaction, editedTransaction]);

    const handleFieldChange = (field: keyof TransactionDTO, value: any) => {
        setEditedTransaction({
            ...editedTransaction,
            [field]: value
        });
    };

    const handleSave = () => {
        onSave(editedTransaction);
    };

    const categories = [
        'ACCOUNT TRANSFER', 'ATM', 'BILL PAYMENT', 'BILLS', 'CREDIT CARD BILL', 
        'CREDIT', 'EMI', 'ENTERTAINMENT', 'FOOD & DRINKS', 'FUEL', 'GROCERIES', 
        'GROWN LOAN', 'HOUSE HOLDS', 'HOUSE RENT', 'INTEREST', 'MEDICINES', 
        'PERSONAL', 'REWARDS', 'SALARY', 'TRANSFER', 'TRAVEL', 'TRIPS', 'WIFE'
    ];

    // Category config currently unused (dropdown shows text only); remove to avoid unused variable warning.

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="primary" onClick={onBack} aria-label="Back" sx={{ ml: 0.5 }}>
                        <ArrowBackIcon fontSize="medium" />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Transaction Details
                    </Typography>
                </Box>
                {hasChanges && (
                    <Button
                        size="small"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                )}
            </Box>

            {/* Card 1: Place (header), Amount (center), Category & Date (footer) */}
            <Box sx={{ bgcolor: 'background.paper', p: 2.5, borderRadius: 3, mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                {/* Header: Place / Description */}
                <Box sx={{ mb: 1, cursor: editingKey === 'place' ? 'auto' : 'text' }} onClick={editingKey !== 'place' ? () => setEditingKey('place') : undefined}>
                    {editingKey === 'place' ? (
                        <TextField
                            fullWidth
                            autoFocus
                            value={editedTransaction.place}
                            onChange={(e) => handleFieldChange('place', e.target.value)}
                            onBlur={() => setEditingKey(null)}
                            variant="standard"
                            InputProps={{ disableUnderline: true, sx: { '& input': { padding: 0, fontWeight: 600 } } }}
                        />
                    ) : (
                        <Typography sx={{ color: 'text.primary', fontSize: '1.05rem', fontWeight: 600 }}>
                            {editedTransaction.place}
                        </Typography>
                    )}
                </Box>

                {/* Center: Amount */}
                <Box sx={{ my: 1.5, textAlign: 'center', cursor: editingKey === 'amount' ? 'auto' : 'text' }} onClick={editingKey !== 'amount' ? () => setEditingKey('amount') : undefined}>
                    {editingKey === 'amount' ? (
                        <TextField
                            fullWidth
                            autoFocus
                            type="number"
                            value={editedTransaction.amount}
                            onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value))}
                            onBlur={() => setEditingKey(null)}
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                sx: { '& input': { padding: 0, textAlign: 'center', fontSize: '2rem', fontWeight: 700 } }
                            }}
                        />
                    ) : (
                        <Typography sx={{ fontWeight: 800, fontSize: '2.1rem', color: editedTransaction.expense === 'Yes' ? 'error.main' : editedTransaction.income === 'Yes' ? 'success.main' : 'text.primary' }}>
                            ₹{editedTransaction.amount}
                        </Typography>
                    )}
                </Box>

                {/* Footer: Category (left) and Date & Time (right) */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                    {/* Category (left) */}
                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Select
                            value={editedTransaction.category || ''}
                            onChange={(e) => handleFieldChange('category', e.target.value)}
                            variant="standard"
                            disableUnderline
                            sx={{
                                bgcolor: categoryConfig.bgColor,
                                color: categoryConfig.color,
                                borderRadius: 2.5,
                                px: 2,
                                py: 0.75,
                                '& .MuiSelect-select': { 
                                    p: 0, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 0.75,
                                    fontWeight: 600
                                },
                            }}
                            renderValue={(value) => (
                                <Stack direction="row" alignItems="center" spacing={0.75}>
                                    {CategoryIcon && <CategoryIcon sx={{ fontSize: 20 }} />}
                                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                        {value || 'Uncategorized'}
                                    </Typography>
                                </Stack>
                            )}
                        >
                            {categories.map((cat) => {
                                const catConfig = getCategoryConfig(cat);
                                const CatIcon = catConfig.icon;
                                return (
                                    <MenuItem key={cat} value={cat}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {CatIcon && <CatIcon sx={{ fontSize: 18 }} />}
                                            <Typography>{cat}</Typography>
                                        </Stack>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </Box>

                    {/* Date & Time (right) */}
                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                        <Typography 
                            sx={{ color: 'text.secondary', fontSize: '0.9rem', cursor: 'pointer' }} 
                            onClick={(e) => setDateTimeAnchor(e.currentTarget)}
                        >
                            {formatDateTime(editedTransaction.date, editedTransaction.time)}
                        </Typography>
                        <Popover
                            open={Boolean(dateTimeAnchor)}
                            anchorEl={dateTimeAnchor}
                            onClose={() => setDateTimeAnchor(null)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        p: 2,
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        minWidth: 220
                                    }
                                }
                            }}
                        >
                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                                        Date
                                    </Typography>
                                    <TextField
                                        type="date"
                                        autoFocus
                                        fullWidth
                                        value={editedTransaction.date.split('T')[0]}
                                        onChange={(e) => handleFieldChange('date', e.target.value + 'T00:00:00')}
                                        variant="standard"
                                        InputProps={{ disableUnderline: true, sx: { '& input': { p: 0, fontSize: '0.9rem' } } }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                                        Time
                                    </Typography>
                                    <TextField
                                        type="time"
                                        fullWidth
                                        value={editedTransaction.time}
                                        onChange={(e) => handleFieldChange('time', e.target.value)}
                                        variant="standard"
                                        InputProps={{ disableUnderline: true, sx: { '& input': { p: 0, fontSize: '0.9rem' } } }}
                                    />
                                </Box>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    onClick={() => setDateTimeAnchor(null)}
                                    sx={{ mt: 0.5 }}
                                >
                                    Done
                                </Button>
                            </Stack>
                        </Popover>
                    </Box>
                </Stack>
            </Box>

            {/* Card 2: Account, Is Expense, Is Irregular (inline) */}
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 3, mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1.5} flexWrap="wrap">
                    {/* Account (editable) */}
                    <Box sx={{ minWidth: 0, flex: { xs: '1 1 100%', sm: '1 1 auto' }, cursor: editingKey === 'account' ? 'auto' : 'text' }} onClick={editingKey !== 'account' ? () => setEditingKey('account') : undefined}>
                        {editingKey === 'account' ? (
                            <TextField
                                fullWidth
                                autoFocus
                                value={editedTransaction.account}
                                onChange={(e) => handleFieldChange('account', e.target.value)}
                                onBlur={() => setEditingKey(null)}
                                variant="standard"
                                InputProps={{ disableUnderline: true, sx: { '& input': { padding: 0 } } }}
                            />
                        ) : (
                            <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>
                                {editedTransaction.account}
                            </Typography>
                        )}
                    </Box>

                    {/* Inline Toggles */}
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center" flexWrap="nowrap">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }} color={editedTransaction.expense === 'Yes' ? 'error.main' : 'text.secondary'}>
                                Is Expense
                            </Typography>
                            <Switch
                                checked={editedTransaction.expense === 'Yes'}
                                onChange={(e) => handleFieldChange('expense', e.target.checked ? 'Yes' : 'No')}
                                color="error"
                                size="small"
                            />
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }} color={editedTransaction.irregularSpends === 'Yes' ? 'warning.main' : 'text.secondary'}>
                                Is Irregular
                            </Typography>
                            <Switch
                                checked={editedTransaction.irregularSpends === 'Yes'}
                                onChange={(e) => handleFieldChange('irregularSpends', e.target.checked ? 'Yes' : null)}
                                color="warning"
                                size="small"
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </Box>

            {/* Card 3: Other Details */}
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                {/* Tags */}
                <Box sx={{ mb: 2, cursor: editingKey === 'tags' ? 'auto' : 'text' }} onClick={editingKey !== 'tags' ? () => setEditingKey('tags') : undefined}>
                    {editingKey === 'tags' ? (
                        <TextField
                            fullWidth
                            autoFocus
                            value={editedTransaction.tags || ''}
                            onChange={(e) => handleFieldChange('tags', e.target.value || null)}
                            onBlur={() => setEditingKey(null)}
                            variant="standard"
                            placeholder="Enter tags"
                            InputProps={{ disableUnderline: true, sx: { '& input': { padding: 0 } } }}
                        />
                    ) : (
                        <Typography sx={{ color: editedTransaction.tags ? 'text.primary' : 'text.disabled' }}>
                            {editedTransaction.tags || 'No tags'}
                        </Typography>
                    )}
                </Box>

                {/* Note */}
                <Box sx={{ cursor: editingKey === 'note' ? 'auto' : 'text' }} onClick={editingKey !== 'note' ? () => setEditingKey('note') : undefined}>
                    {editingKey === 'note' ? (
                        <TextField
                            fullWidth
                            autoFocus
                            multiline
                            rows={2}
                            value={editedTransaction.note || ''}
                            onChange={(e) => handleFieldChange('note', e.target.value || null)}
                            onBlur={() => setEditingKey(null)}
                            variant="standard"
                            placeholder="Enter note"
                            InputProps={{ disableUnderline: true, sx: { '& textarea': { padding: 0 } } }}
                        />
                    ) : (
                        <Typography sx={{ color: editedTransaction.note ? 'text.primary' : 'text.disabled', whiteSpace: 'pre-wrap', pr: 1 }}>
                            {editedTransaction.note || 'No note'}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default TransactionEdit;
