import { Avatar, Box, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import { trans } from "core/api/mock/transactions-data";
import { currencyFormat } from "core/utils/format-functions";
import { useEffect, useMemo, useState } from "react";
import { categoriseSpends, groupSpendsCategory } from "domain/transactions/services";
import { SpendCategoryGroupDTO, SpendsGroupDTO } from "domain/transactions/types";
import { theme } from "theme/theme";
import ExpensesHeader from "./ExpensesHeader";

interface ExpensesProps {
    startDate: Date;
    endDate: Date;
}

const Expenses = ({ startDate, endDate }: ExpensesProps) => {

    const filteredTransactions = useMemo(() => {
        return trans.filter(tran => {
            const tranDate = new Date(tran.date);
            return tranDate >= startDate && tranDate <= endDate;
        });
    }, [startDate, endDate]);

    const spendsGroup = useMemo<SpendCategoryGroupDTO[]>(() => groupSpendsCategory(filteredTransactions), [filteredTransactions]);

    const [groupNames, setGroupNames] = useState<SpendsGroupDTO[]>(spendsGroup.map(i => i.group))
    const [spends, setSpends] = useState(categoriseSpends(filteredTransactions));

    useEffect(() => {setSpends(categoriseSpends(filteredTransactions, groupNames))},[groupNames, filteredTransactions])

    console.log("groupNames", groupNames)

    return (
        <Box>
            <ExpensesHeader
                groupNames={groupNames}
                setGroupNames={setGroupNames}
                spends={spends}
                spendsGroup={spendsGroup}
            />
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
            >
                {spends.map(cat => <ListItemButton sx={{ border: '1px solid' + theme.palette.grey[400], borderRadius: '17px', marginBottom: '10px' }}>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={cat.name} slotProps={{
                        primary: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px', // adjust as needed
                        }, secondary: { color: theme.palette.grey[600], fontSize: '11px' }
                    }} secondary={cat.spendsCount + ' spends | ' + cat.percentage + '%'} />
                    <Box>
                        <Stack direction={'column'}>
                            <Grid >
                                <Typography variant="h6" color={theme.palette.grey[700]} textAlign={"end"}>{currencyFormat(cat.totalAmount)}</Typography>

                            </Grid>
                            <Grid>
                                <Stack direction={'row'}>
                                    <Typography variant="body2" color={'grey'}>Set Budget</Typography>
                                </Stack>
                            </Grid>
                        </Stack>
                    </Box>
                </ListItemButton>
                )}
            </List>
        </Box>
    )
}

export default Expenses;
