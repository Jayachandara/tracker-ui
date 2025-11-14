import { Avatar, Box, IconButton, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { trans } from "core/api/mock/transactions-data";
import { currencyFormat, formatDateTime } from 'core/utils/format-functions';
import { getCategoryConfig } from 'core/config/category-config';
import { useMemo, useState } from 'react';
import { TransactionDTO } from 'domain/transactions/types';
import TransactionEdit from './TransactionEdit';

interface TransactionsProps {
    startDate: Date;
    endDate: Date;
    categoryFilter?: string | null;
    onBack?: () => void;
    othersOnly?: boolean;
    onViewingDetails?: (isViewing: boolean) => void;
}

const Transactions = ({ startDate, endDate, categoryFilter, onBack, othersOnly, onViewingDetails }: TransactionsProps) => {
    const [editingTransaction, setEditingTransaction] = useState<TransactionDTO | null>(null);

    const filteredTransactions = useMemo(() => {
        return trans.filter(tran => {
            const tranDate = new Date(tran.date);
            const inRange = tranDate >= startDate && tranDate <= endDate;
            const byCategory = !categoryFilter || (tran.category ?? 'UNCATEGORIZED') === categoryFilter;
            const isOther = othersOnly ? (tran.expense !== 'Yes' && tran.income !== 'Yes') : true;
            return inRange && byCategory && isOther;
        });
    }, [startDate, endDate, categoryFilter, othersOnly]);

    const handleEdit = (transaction: TransactionDTO) => {
        setEditingTransaction(transaction);
        onViewingDetails?.(true);
    };

    const handleSaveTransaction = (transaction: TransactionDTO) => {
        // TODO: Implement save logic to update the transaction
        console.log('Saving transaction:', transaction);
        setEditingTransaction(null);
        onViewingDetails?.(false);
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
        onViewingDetails?.(false);
    };

    // If editing, show the edit view
    if (editingTransaction) {
        return (
            <TransactionEdit 
                transaction={editingTransaction}
                onBack={handleCancelEdit}
                onSave={handleSaveTransaction}
            />
        );
    }

    return (
        <Box>
            {onBack && (
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color="primary" onClick={onBack} aria-label="Back" sx={{ ml: 0.5 }}>
                        <ArrowBackIcon fontSize="medium" />
                    </IconButton>
                    {categoryFilter ? (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {categoryFilter}
                        </Typography>
                    ) : null}
                </Box>
            )}
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
            >
                {filteredTransactions.map((tran, index) => {
                    const categoryConfig = getCategoryConfig(tran.category);
                    const CategoryIcon = categoryConfig.icon;
                    const transactionId = `${tran.date}-${tran.place}-${index}`;
                    
                    return (
                    <Box key={transactionId}>
                        <ListItemButton onClick={() => handleEdit(tran)}>
                    <ListItemAvatar>
                        <Avatar sx={{ 
                            bgcolor: categoryConfig.bgColor,
                            color: categoryConfig.color,
                            fontWeight: 600,
                            fontSize: '1.2rem'
                        }}>
                            {CategoryIcon ? <CategoryIcon /> : categoryConfig.letter}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={tran.place} slotProps={{
                        primary: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px',
                        },
                    }} secondary={tran.category} />
                    <Box>
                        <Stack direction={'column'}>
                            <Box>
                                <Typography variant="h6" color={tran.type === 'DR' ? 'grey' : 'grey'} textAlign={"end"}>{currencyFormat(tran.amount)}</Typography>
                            </Box>
                            <Box>
                                <Stack direction={'row'}>
                                    <Typography variant="body2" color={'grey'}>{formatDateTime(tran.date)}</Typography>
                                    {tran.type === 'DR' ? <CallMadeIcon sx={{ fontSize: '16px', marginLeft: '5px' }} fontSize="small" color="warning" />
                                        : <CallReceivedIcon sx={{ fontSize: '16px', marginLeft: '5px' }} fontSize="small" color="success" />}
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </ListItemButton>
                      <Divider component="li" />
                    </Box>
                )})}
            </List>
        </Box>
    )
}

export default Transactions;
