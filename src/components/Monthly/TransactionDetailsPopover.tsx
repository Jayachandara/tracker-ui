import { Box, Popover, Typography, Chip, Stack, IconButton, Switch, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TransactionDTO } from 'domain/transactions/types';
import { currencyFormat, formatDateTime } from 'core/utils/format-functions';
import { getCategoryConfig } from 'core/config/category-config';

interface TransactionDetailsPopoverProps {
    transaction: TransactionDTO | null;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const TransactionDetailsPopover = ({ transaction, anchorEl, onClose }: TransactionDetailsPopoverProps) => {
    const open = Boolean(anchorEl && transaction);

    if (!transaction) return null;

    const categoryConfig = getCategoryConfig(transaction.category);
    const CategoryIcon = categoryConfig.icon;

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            slotProps={{
                paper: {
                    sx: {
                        width: 320,
                        maxWidth: '90vw',
                        p: 0,
                    }
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                {/* Amount - Prominently displayed at top */}
                <Box sx={{ textAlign: 'center', mb: 2, py: 1.5, bgcolor: transaction.type === 'DR' ? 'warning.lighter' : 'success.lighter', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {transaction.type === 'DR' ? 'Debit' : 'Credit'}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color={transaction.type === 'DR' ? 'warning.dark' : 'success.dark'}>
                        {currencyFormat(transaction.amount)}
                    </Typography>
                </Box>
                {/* Close button */}
                <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>

                {/* Place/Description */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                        Place
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                        {transaction.place}
                    </Typography>
                </Box>

                {/* Category */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                        Category
                    </Typography>
                    <Chip 
                        icon={CategoryIcon ? <CategoryIcon sx={{ fontSize: '16px' }} /> : undefined}
                        label={transaction.category || 'UNCATEGORIZED'}
                        size="small"
                        sx={{
                            bgcolor: categoryConfig.bgColor,
                            color: categoryConfig.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                        }}
                    />
                </Box>

                {/* Date and Time */}
                <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}>
                            Date
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                            {formatDateTime(transaction.date)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}>
                            Time
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                            {transaction.time}
                        </Typography>
                    </Box>
                </Stack>

                {/* Account */}
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}>
                        Account
                    </Typography>
                    <Typography variant="body2" fontSize="0.8rem">
                        {transaction.account}
                    </Typography>
                </Box>

                {/* Transaction Flag - Conditional based on type */}
                {transaction.type === 'DR' ? (
                    <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Expense
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={transaction.expense === 'Yes'} 
                                        size="small"
                                        color="error"
                                    />
                                }
                                label=""
                                sx={{ m: 0 }}
                            />
                        </Stack>
                    </Box>
                ) : (
                    <Box sx={{ mb: 1.5 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Income
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={transaction.income === 'Yes'} 
                                        size="small"
                                        color="success"
                                    />
                                }
                                label=""
                                sx={{ m: 0 }}
                            />
                        </Stack>
                    </Box>
                )}

                {/* Irregular Spends */}
                {transaction.irregularSpends && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}>
                            Irregular Spends
                        </Typography>
                        <Chip 
                            label={transaction.irregularSpends}
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '22px' }}
                        />
                    </Box>
                )}

                {/* Tags */}
                {transaction.tags && (
                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}>
                            Tags
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                            {transaction.tags}
                        </Typography>
                    </Box>
                )}

                {/* Note */}
                {transaction.note && (
                    <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem' }}>
                            Note
                        </Typography>
                        <Typography variant="body2" fontSize="0.8rem">
                            {transaction.note}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Popover>
    );
};

export default TransactionDetailsPopover;
