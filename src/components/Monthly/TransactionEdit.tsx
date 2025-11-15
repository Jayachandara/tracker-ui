import { Box, IconButton, Stack, Typography, TextField, Button, Switch, Popover, Avatar } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { TransactionDTO } from 'domain/transactions/types';
import { getCategoryConfig } from 'core/config/category-config';
import { getAccountConfig } from 'core/config/account-config';
import { useState, useMemo } from 'react';

interface TransactionEditProps {
    transaction: TransactionDTO;
    onBack: () => void;
    onSave: (transaction: TransactionDTO) => void;
}

const TransactionEdit = ({ transaction, onBack, onSave }: TransactionEditProps) => {
    const [editedTransaction, setEditedTransaction] = useState<TransactionDTO>({ ...transaction });
    const [editingKey, setEditingKey] = useState<null | 'amount' | 'place' | 'datetime' | 'tags' | 'note'>(null);
    const [dateTimeAnchor, setDateTimeAnchor] = useState<HTMLElement | null>(null);
    const [categoryAnchor, setCategoryAnchor] = useState<HTMLElement | null>(null);
    const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);
    const [newCategoryText, setNewCategoryText] = useState<string>('');

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
    const accountConfig = getAccountConfig(editedTransaction.account);

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

    const accounts = [
        'HDFC  4671', 'HDFC credit 2788', 'HDFC credit 9603',
        'ICICI  5432', 'ICICI credit 1234',
        'IDFC  6145', 'IDFC credit 6093', 'IDFC credit 8696', 'IDFC debit 6145',
        'HSBC  4006', 'HSBC  XXXX',
        'Axis  7890', 'Axis credit 3456',
        'CASH', 'CASH Spends'
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
                    <Box 
                        sx={{ 
                            display: 'inline-flex', 
                            alignItems: 'center',
                            bgcolor: categoryConfig.bgColor,
                            color: categoryConfig.color,
                            borderRadius: 2.5,
                            px: 2,
                            py: 0.75,
                            cursor: 'pointer'
                        }}
                        onClick={(e) => setCategoryAnchor(e.currentTarget)}
                    >
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                            {CategoryIcon && <CategoryIcon sx={{ fontSize: 20 }} />}
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                {editedTransaction.category || 'Uncategorized'}
                            </Typography>
                        </Stack>
                    </Box>

                    <Popover
                        open={Boolean(categoryAnchor)}
                        anchorEl={categoryAnchor}
                        onClose={() => setCategoryAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    p: 1.5,
                                    width: 330,
                                    maxHeight: 350,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }
                            }
                        }}
                    >
                        <TextField
                            placeholder="Add new category..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={newCategoryText}
                            onChange={(e) => setNewCategoryText(e.target.value)}
                            sx={{ mb: 1.5, flexShrink: 0 }}
                            InputProps={{
                                endAdornment: newCategoryText.trim() && (
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            const newCategory = newCategoryText.trim().toUpperCase();
                                            if (newCategory) {
                                                handleFieldChange('category', newCategory);
                                                setNewCategoryText('');
                                                setCategoryAnchor(null);
                                            }
                                        }}
                                        sx={{ minWidth: 'auto', px: 1.5 }}
                                    >
                                        Save
                                    </Button>
                                )
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    const newCategory = newCategoryText.trim().toUpperCase();
                                    if (newCategory) {
                                        handleFieldChange('category', newCategory);
                                        setNewCategoryText('');
                                        setCategoryAnchor(null);
                                    }
                                }
                            }}
                        />
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: 0.75, 
                            overflow: 'auto',
                            p: 0.75,
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            {categories.map((cat) => {
                                const catConfig = getCategoryConfig(cat);
                                const CatIcon = catConfig.icon;
                                const isSelected = editedTransaction.category === cat;
                                return (
                                    <Box
                                        key={cat}
                                        onClick={() => {
                                            handleFieldChange('category', cat);
                                            setCategoryAnchor(null);
                                        }}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: 0.75,
                                            borderRadius: 1.5,
                                            bgcolor: isSelected ? catConfig.bgColor : 'background.paper',
                                            border: '1px solid',
                                            borderColor: isSelected ? catConfig.color : 'divider',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease-in-out',
                                            position: 'relative',
                                            '&:hover': {
                                                bgcolor: catConfig.bgColor,
                                                borderColor: catConfig.color,
                                                transform: 'scale(1.03)',
                                                zIndex: 1,
                                            }
                                        }}
                                    >
                                        {CatIcon ? (
                                            <CatIcon sx={{ fontSize: 28, color: catConfig.color, mb: 0.25 }} />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '50%',
                                                    bgcolor: catConfig.bgColor,
                                                    border: `2px solid ${catConfig.color}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 0.25,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        color: catConfig.color,
                                                    }}
                                                >
                                                    {cat.charAt(0).toUpperCase()}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Typography 
                                            sx={{ 
                                                fontSize: '0.65rem', 
                                                fontWeight: isSelected ? 600 : 500,
                                                color: isSelected ? catConfig.color : 'text.primary',
                                                textAlign: 'center',
                                                lineHeight: 1,
                                            }}
                                        >
                                            {cat}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Popover>

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
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-end', sm: 'center' }} justifyContent="space-between" spacing={1.5} flexWrap="wrap">
                    {/* Account (dropdown with popover) */}
                    <Box 
                        sx={{ 
                            minWidth: 0, 
                            flex: { xs: '1 1 100%', sm: '1 1 auto' }, 
                            cursor: 'pointer', 
                            alignSelf: { xs: 'flex-start', sm: 'center' } 
                        }} 
                        onClick={(e) => setAccountAnchor(e.currentTarget)}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                                src={accountConfig.bankLogo}
                                alt={editedTransaction.account}
                                imgProps={{
                                    onError: (e) => {
                                        e.currentTarget.style.display = 'none';
                                    }
                                }}
                                sx={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 1.5,
                                    bgcolor: accountConfig.bgColor,
                                    border: `2px solid ${accountConfig.color}`
                                }}
                            >
                                {accountConfig.icon && (
                                    <accountConfig.icon sx={{ fontSize: 18, color: accountConfig.color }} />
                                )}
                            </Avatar>
                            <Typography sx={{ color: 'text.primary', fontWeight: 500, fontSize: '1rem' }}>
                                {editedTransaction.account}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Account Popover */}
                    <Popover
                        open={Boolean(accountAnchor)}
                        anchorEl={accountAnchor}
                        onClose={() => setAccountAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    p: 1.5,
                                    maxHeight: 400,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }
                            }
                        }}
                    >
                        <Stack spacing={1} sx={{ 
                            p:1,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                display: 'none'
                            },
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            {accounts.map((account) => {
                                const accConfig = getAccountConfig(account);
                                const AccIcon = accConfig.icon;
                                const isSelected = editedTransaction.account === account;
                                return (
                                    <Box
                                        key={account}
                                        onClick={() => {
                                            handleFieldChange('account', account);
                                            setAccountAnchor(null);
                                        }}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            p: 1.25,
                                            borderRadius: 2,
                                            bgcolor: isSelected ? accConfig.bgColor : 'background.paper',
                                            border: '1px solid',
                                            borderColor: isSelected ? accConfig.color : 'divider',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease-in-out',
                                            '&:hover': {
                                                bgcolor: accConfig.bgColor,
                                                borderColor: accConfig.color,
                                                transform: 'translateX(2px)',
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={accConfig.bankLogo}
                                            alt={account}
                                            imgProps={{
                                                onError: (e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }
                                            }}
                                            sx={{
                                                width: 30,
                                                height: 30,
                                                borderRadius: 1.5,
                                                bgcolor: accConfig.bgColor,
                                                border: `2px solid ${accConfig.color}`
                                            }}
                                        >
                                            {AccIcon && (
                                                <AccIcon sx={{ fontSize: 16, color: accConfig.color }} />
                                            )}
                                        </Avatar>
                                        <Typography 
                                            sx={{ 
                                                fontSize: '0.75rem', 
                                                fontWeight: isSelected ? 600 : 500,
                                                color: isSelected ? accConfig.color : 'text.primary',
                                            }}
                                        >
                                            {account}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Popover>

                    {/* Inline Toggles */}
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center" flexWrap="nowrap">
                        {editedTransaction.type === 'DR' ? (
                            <>
                                <Stack direction="column" spacing={0.5} alignItems="center">
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
                                <Stack direction="column" spacing={0.5} alignItems="center">
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
                            </>
                        ) : (
                            <Stack direction="column" spacing={0.5} alignItems="center">
                                <Typography variant="body2" sx={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }} color={editedTransaction.income === 'Yes' ? 'success.main' : 'text.secondary'}>
                                    Is Income
                                </Typography>
                                <Switch
                                    checked={editedTransaction.income === 'Yes'}
                                    onChange={(e) => handleFieldChange('income', e.target.checked ? 'Yes' : 'No')}
                                    color="success"
                                    size="small"
                                />
                            </Stack>
                        )}
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
