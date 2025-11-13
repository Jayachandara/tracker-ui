import { Avatar, Box, Divider, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, Typography } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import IconifyIcon from "components/base/IconifyIcon";
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { trans } from "./Trans";

const Transactions = () => {

    return (
        <Box>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
            >
                {trans.map(tran => <><ListItemButton>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={tran.PLACE} primaryTypographyProps={{
                        sx: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px', // adjust as needed
                        },
                    }} secondary={tran.CATEGORY} />
                    <Box>
                        <Stack direction={'column'}>
                            <Grid >
                                <Typography variant="h6" color={tran.TYPE === 'DR' ? 'grey' : 'grey'} textAlign={"end"}>{tran.AMOUNT}</Typography>

                            </Grid>
                            <Grid>
                                <Stack direction={'row'}>
                                    <Typography variant="body2" color={'grey'}>{tran.DATE}</Typography>
                                    {tran.TYPE === 'DR' ? <CallMadeIcon sx={{ fontSize: '16px', marginLeft: '5px' }} fontSize="small" color="warning" />
                                        : <CallReceivedIcon sx={{ fontSize: '16px', marginLeft: '5px' }} fontSize="small" color="success" />}
                                </Stack>
                            </Grid>
                        </Stack>
                    </Box>
                </ListItemButton>
                      <Divider component="li" />
                      </>

                )}
            </List>
        </Box>
    )
}

export default Transactions;
