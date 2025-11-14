import { Avatar, Box, IconButton, Divider, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { trans } from "core/api/mock/transactions-data";
import { currencyFormat, formatDateTime } from 'core/utils/format-functions';
import { useMemo } from 'react';

interface TransactionsProps {
    startDate: Date;
    endDate: Date;
    categoryFilter?: string | null;
    onBack?: () => void;
}

const Transactions = ({ startDate, endDate, categoryFilter, onBack }: TransactionsProps) => {
    const filteredTransactions = useMemo(() => {
        return trans.filter(tran => {
            const tranDate = new Date(tran.date);
            const inRange = tranDate >= startDate && tranDate <= endDate;
            const byCategory = !categoryFilter || (tran.category ?? 'UNCATEGORIZED') === categoryFilter;
            return inRange && byCategory;
        });
    }, [startDate, endDate, categoryFilter]);

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
                {filteredTransactions.map((tran, index) => (
                    <Box key={`${tran.date}-${tran.place}-${index}`}>
                        <ListItemButton>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={tran.place} slotProps={{
                        primary: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px', // adjust as needed
                        },
                    }} secondary={tran.category} />
                    <Box>
                        <Stack direction={'column'}>
                            <Grid >
                                <Typography variant="h6" color={tran.type === 'DR' ? 'grey' : 'grey'} textAlign={"end"}>{currencyFormat(tran.amount)}</Typography>

                            </Grid>
                            <Grid>
                                <Stack direction={'row'}>
                                    <Typography variant="body2" color={'grey'}>{formatDateTime(tran.date)}</Typography>
                                    {tran.type === 'DR' ? <CallMadeIcon sx={{ fontSize: '16px', marginLeft: '5px' }} fontSize="small" color="warning" />
                                        : <CallReceivedIcon sx={{ fontSize: '16px', marginLeft: '5px' }} fontSize="small" color="success" />}
                                </Stack>
                            </Grid>
                        </Stack>
                    </Box>
                </ListItemButton>
                      <Divider component="li" />
                    </Box>
                ))}
            </List>
        </Box>
    )
}

export default Transactions;
