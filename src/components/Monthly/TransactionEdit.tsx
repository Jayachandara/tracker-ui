import { Box, IconButton, Stack, Typography, TextField, Select, MenuItem, Button, Switch } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
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
    const dateTimeValue: Dayjs = dayjs(`${editedTransaction.date.split('T')[0]}T${editedTransaction.time}`);

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
                    <Select
                        value={editedTransaction.category || ''}
                        onChange={(e) => handleFieldChange('category', e.target.value)}
                        variant="standard"
                        disableUnderline
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            '& .MuiSelect-select': { p: 0, display: 'flex', alignItems: 'center', gap: 0.75 },
                        }}
                        renderValue={(value) => (
                            <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                                {value || 'Uncategorized'}
                            </Typography>
                        )}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Date & Time (right) */}
                    <Box sx={{ flex: 1, textAlign: 'right' }}>
                        {editingKey === 'datetime' ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    value={dateTimeValue}
                                    onChange={(v: Dayjs | null) => {
                                        if (!v) return;
                                        handleFieldChange('date', v.format('YYYY-MM-DD') + 'T00:00:00');
                                        handleFieldChange('time', v.format('HH:mm'));
                                    }}
                                    onClose={() => setEditingKey(null)}
                                    slotProps={{
                                        textField: {
                                            variant: 'standard',
                                            InputProps: { disableUnderline: true },
                                            sx: { '& input': { p: 0, textAlign: 'right', fontSize: '0.85rem' } }
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        ) : (
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setEditingKey('datetime')}>
                                {new Date(editedTransaction.date).toLocaleDateString()} • {editedTransaction.time}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>

            {/* Card 2: Account, Is Expense, Is Regular (inline) */}
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 3, mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                    {/* Account (editable) */}
                    <Box sx={{ minWidth: 200, flex: 1, cursor: editingKey === 'account' ? 'auto' : 'text' }} onClick={editingKey !== 'account' ? () => setEditingKey('account') : undefined}>
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
                    <Stack direction="row" spacing={3} alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color={editedTransaction.expense === 'Yes' ? 'error.main' : 'text.secondary'}>
                                Is Expense
                            </Typography>
                            <Switch
                                checked={editedTransaction.expense === 'Yes'}
                                onChange={(e) => handleFieldChange('expense', e.target.checked ? 'Yes' : 'No')}
                                color="error"
                                size="small"
                            />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color={editedTransaction.irregularSpends === 'Yes' ? 'text.secondary' : 'success.main'}>
                                Is Regular
                            </Typography>
                            <Switch
                                checked={editedTransaction.irregularSpends !== 'Yes'}
                                onChange={(e) => handleFieldChange('irregularSpends', e.target.checked ? null : 'Yes')}
                                color="success"
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
