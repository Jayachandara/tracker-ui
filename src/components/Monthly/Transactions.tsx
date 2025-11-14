import { Avatar, Box, Divider, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { trans } from "core/api/mock/transactions-data";
import { currencyFormat, formatDateTime } from 'core/utils/format-functions';
import { useMemo } from 'react';

interface TransactionsProps {
    startDate: Date;
    endDate: Date;
}

const Transactions = ({ startDate, endDate }: TransactionsProps) => {
    const filteredTransactions = useMemo(() => {
        return trans.filter(tran => {
            const tranDate = new Date(tran.date);
            return tranDate >= startDate && tranDate <= endDate;
        });
    }, [startDate, endDate]);

    return (
        <Box>
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
